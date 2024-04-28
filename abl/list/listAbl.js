const listDao = require("../../dao/list-dao.js");

async function ListAbl(req, res) {
    try {
        const listList = listDao.list();

        const itemsMap = itemDao.itemMap();

        listList.forEach((list) => {
            list.userMap = itemDao[list.id] || {};
        });

        res.json(listList);
    } catch (e) {
        res.status(500).json({message: e.message});
    }
}

module.exports = ListAbl;
