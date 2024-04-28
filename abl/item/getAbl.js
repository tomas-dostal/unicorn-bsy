const Ajv = require("ajv");
const ajv = new Ajv();
const itemDao = require("../../dao/item-dao.js");

const schema = {
    type: "object",
    properties: {
        id: {type: "string", minLength: 32, maxLength: 32},
        listId: {type: "string", minLength: 32, maxLength: 32},
        userId: {type: "string", minLength: 32, maxLength: 32},
    },
    required: ["id", "listId", "userId"],
    additionalProperties: false,
};

async function GetAbl(req, res) {
    try {
        // get request query or body
        const reqParams = req.query?.id ? req.query : req.body;

        // validate input
        const valid = ajv.validate(schema, reqParams);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                note: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        // read item by given id
        const item = itemDao.get(reqParams.id);
        if (!item) {
            res.status(404).json({
                code: "itemNotFound",
                note: `Item ${reqParams.id} not found`,
            });
            return;
        }

        res.json(item);
    } catch (e) {
        res.status(500).json({note: e.note});
    }
}

module.exports = GetAbl;
