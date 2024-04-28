const Ajv = require("ajv");
const addFormats = require("ajv-formats").default;
const ajv = new Ajv();
addFormats(ajv);

const listDao = require("../../dao/list-dao.js");

const schema = {
    type: "object",
    properties: {
        id: {type: "string", minLength: 32, maxLength: 32},
        name: {type: "string", minLength: 3},
        createdAt: { readOnly: true, type: "string", format: "date-time"},
        modifiedAt: { readOnly: true, type: "string", format: "date-time"},
        userId: { readOnly: true },
        sharedWith: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    userId: {type: "string", minLength: 32, maxLength: 32}
                },
                required: ["userId"],
                additionalProperties: false
            }
        }
    },
    required: ["id", "name"],
    // Define property level readOnly to prevent updates to userId (transferring lists to another user)
    // This will allow the userId field to be set only during creation but disallow updates to it.
    additionalProperties: false,
};

// Uživatel (owner)
// Tento aktér je vlastníkem nákupního seznamu.
// Má práva k vytváření, úpravám a mazání nákupních seznamů a položek listu
// Může pozvat další uživatele k účasti na nákupním seznamu (shares the list)
// Může označit položku seznamu za dokončenou
// Uživatel (Cotributor):
// Tento aktér je členem nákupního seznamu.
// Má omezená práva v rámci nákupního seznamu (např. přidávání/odebírání položek, nemůže přidávat ani odebírat členy)
// Může označit položku seznamu za dokončenou

async function UpdateAbl(req, res) {
    try {
        let list = req.body;

        // validate input
        const valid = ajv.validate(schema, list);
        if (!valid) {
            res.status(400).json({
                code: "dtoInIsNotValid",
                message: "dtoIn is not valid",
                validationError: ajv.errors,
            });
            return;
        }

        const updatedList = listDao.update(list);
        if (!updatedList) {
            res.status(404).json({
                code: "listNotFound",
                message: `List ${list.id} not found`,
            });
            return;
        }

        res.json(updatedList);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

module.exports = UpdateAbl;
