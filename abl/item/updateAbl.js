const Ajv = require("ajv");
const ajv = new Ajv();
const validateDateTime = require("../../helpers/validate-date-time.js");
ajv.addFormat("date-time", {validate: validateDateTime});

const noteDao = require("../../dao/item-dao.js");

/*

const schema = {
  type: "object",
  properties: {
    listId: { type: "string", minLength: 32, maxLength: 32 },
    userId: { type: "string", minLength: 32, maxLength: 32 },
    finished: { enum: ["yes", "no", null] },
  },
  required: ["listId", "userId"],
  additionalProperties: false,
};

 */
const schema = {
    type: "object", properties: {
        id: {type: "string"},
        date: {type: "string", format: "date-time"},
        name: {type: "string"},
        note: {type: "string"},
    }, required: ["id"], additionalProperties: false,
};

async function UpdateAbl(req, res) {
    try {
        let note = req.body;

        // validate input
        const valid = ajv.validate(schema, note);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid", note: "dtoIn is not valid", validationError: ajv.errors,
            });
            return;
        }

        const updatedNote = noteDao.update(note);

        if (!updatedNote) {
            res.status(404).json({
                code: "noteNotFound", message: `Note ${note.id} not found`,
            });
            return;
        }

        res.json(updatedNote);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

module.exports = UpdateAbl;
