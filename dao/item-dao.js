const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const itemFolderPath = path.join(__dirname, "storage", "itemList");

// Method to read an item from a file
function get(itemId) {
    try {
        const filePath = path.join(itemFolderPath, `${itemId}.json`);
        const fileData = fs.readFileSync(filePath, "utf8");
        return JSON.parse(fileData);
    } catch (error) {
        if (error.code === "ENOENT") return null;
        throw {code: "failedToReadNote", item: error.item};
    }
}

// Method to write an item to a file
function create(item) {
    try {
        item.id = crypto.randomBytes(16).toString("hex");
        const filePath = path.join(itemFolderPath, `${item.id}.json`);
        const fileData = JSON.stringify(item);
        fs.writeFileSync(filePath, fileData, "utf8");
        return item;
    } catch (error) {
        throw {code: "failedToCreateNote", item: error.item};
    }
}

// Method to update item in a file
function update(item) {
    try {
        const currentNote = get(item.id);
        if (!currentNote) return null;
        const newNote = {...currentNote, ...item};
        const filePath = path.join(itemFolderPath, `${item.id}.json`);
        const fileData = JSON.stringify(newNote);
        fs.writeFileSync(filePath, fileData, "utf8");
        return newNote;
    } catch (error) {
        throw {code: "failedToUpdateNote", item: error.item};
    }
}

// Method to remove an item from a file
function remove(itemId) {
    try {
        const filePath = path.join(itemFolderPath, `${itemId}.json`);
        fs.unlinkSync(filePath);
        return {};
    } catch (error) {
        if (error.code === "ENOENT") {
            return {};
        }
        throw {code: "failedToRemoveNote", item: error.item};
    }
}

// Method to list items in a folder
function list() {
    try {
        const files = fs.readdirSync(itemFolderPath);
        const itemList = files.map((file) => {
            const fileData = fs.readFileSync(path.join(itemFolderPath, file), "utf8");
            return JSON.parse(fileData);
        });
        return itemList;
    } catch (error) {
        throw {code: "failedToListNotes", item: error.item};
    }
}

function listMap() {
    const itemList = list();
    const listMap = {};
    itemList.forEach((i) => {
        if (!listMap[i.id])
            listMap[i.listId] = {};
        listMap[i.listId][i.id] = {
            "item": i.item
        };
    });
    return listMap;
}

module.exports = {
    get,
    create,
    update,
    remove,
    list,
    listMap
};
