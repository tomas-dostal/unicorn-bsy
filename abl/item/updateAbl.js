const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", {validate: validateDateTime});

const itemDao = require("../../dao/item-dao.js");
const {BasicUserCheck} = require("./createAbl");
const ItemBasicUserCheck = require("./helper");


const schema = {
    type: "object", properties: {
        id: {type: "string", minLength: 32, maxLength: 32},
        text: {type: "string"},
        listId: {type: "string", minLength: 32, maxLength: 32},
        userId: {type: "string", minLength: 32, maxLength: 32},
        finished: {type: "boolean", default: false},
    }, required: ["id", "listId", "userId"], additionalProperties: false,
};

async function UpdateAbl(req, res) {
    try {
        let item = req.body;

        // validate input
        const valid = ajv.validate(schema, item);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid", message: "dtoIn is not valid", validationError: ajv.errors,
            });
            return;
        }

        const updatedNote = itemDao.update(item);

        if (!updatedNote) {
            res.status(404).json({
                code: "itemNotFound", message: `Note ${item.id} not found`,
            });
            return;
        }

        const isBasicUserCheckPassed = await ItemBasicUserCheck(item, res);
        if (!isBasicUserCheckPassed) {
            return;
        }

        res.json(updatedNote);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

module.exports = UpdateAbl;
