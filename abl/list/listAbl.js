const listDao = require("../../dao/list-dao.js");
const itemDao = require("../../dao/item-dao.js");

async function ListAbl(req, res) {
    try {
        const listList = listDao.list();



        const itemsMap = itemDao.listMap();

        listList.forEach((list) => {
            list.itemsMap = itemDao[list.id] || {};
        });

        res.json(listList);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

module.exports = ListAbl;
