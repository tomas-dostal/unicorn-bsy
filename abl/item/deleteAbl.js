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

async function DeleteAbl(req, res) {
    try {
        // get request query or body
        const reqParams = req.body;

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

        itemDao.remove(reqParams.id);
        res.json({});
    } catch (e) {
        res.status(500).json({note: e.note});
    }
}

module.exports = DeleteAbl;
