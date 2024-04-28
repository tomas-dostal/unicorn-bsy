const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/item/getAbl");
const ListAbl = require("../abl/item/listAbl");
const CreateAbl = require("../abl/item/createAbl");
const UpdateAbl = require("../abl/item/updateAbl");
const DeleteAbl = require("../abl/item/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
