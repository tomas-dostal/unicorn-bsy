const userDao = require("../../dao/user-dao");
const listDao = require("../../dao/list-dao");
const {isListSharedWith} = require("../../dao/user-dao");

async function ItemBasicUserCheck(item, res) {
    console.log(item);
    const user = userDao.get(item.userId);
    if (!user) {
        res.status(404).json({
            code: "userNotFound",
            message: `User ${item.userId} not found`,
        });
        return false;
    }

    const list = listDao.get(item.listId);
    console.log(list);

    if (!list) {
        res.status(404).json({
            code: "listNotFound",
            message: `List ${item.listId} not found`,
        });
        return false;
    }

    console.log(user);
    console.log(user.id);
    console.log(list.sharedWith);

    if (!isListSharedWith(list, user.id) && list.userId !== user.id) {
        res.status(403).json({
            code: "userHasNoPermissionToList",
            message: `User ${user.id} has no permission to list ${list.id}`,
        });
        return false;
    }
    console.log("sisListSharedWith");

    return true;
}

module.exports = ItemBasicUserCheck;
