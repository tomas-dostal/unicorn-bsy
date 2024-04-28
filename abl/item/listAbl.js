const itemDao = require("../../dao/item-dao.js");

async function ListAbl(req, res) {
    try {
        const itemList = itemDao.list();
        res.json(itemList);
    } catch (e) {
        res.status(500).json({note: e.note});
    }
}

module.exports = ListAbl;
