const Ajv = require("ajv");
const ajv = new Ajv();

const itemDao = require("../../dao/item-dao.js");
const listDao = require("../../dao/list-dao.js");
const userDao = require("../../dao/user-dao");
const {isListSharedWith} = require("../../dao/user-dao");
const ItemBasicUserCheck = require("./helper");

const schema = {
    type: "object",
    properties: {
        text: {type: "string"},
        listId: {type: "string", minLength: 32, maxLength: 32},
        userId: {type: "string", minLength: 32, maxLength: 32},
        finished: {type: "boolean", default: false},
    },
    required: ["text", "listId", "userId"],
    additionalProperties: false,
};

async function CreateAbl(req, res) {
    try {
        let item = req.body;

        // validate input
        const valid = ajv.validate(schema, item);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }
        const isBasicUserCheckPassed = await ItemBasicUserCheck(item, res);
        if (!isBasicUserCheckPassed) {
            return;
        }
        item.createdAt = new Date().toISOString();
        item.finished = item.finished !== null ? item.finished : false;
        item = itemDao.create(item);
        res.json(item);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}


module.exports = CreateAbl;