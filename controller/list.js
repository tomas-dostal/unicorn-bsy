const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/list/getAbl");
const ListAbl = require("../abl/list/listAbl");
const CreateAbl = require("../abl/list/createAbl");
const UpdateAbl = require("../abl/list/updateAbl");
const DeleteAbl = require("../abl/list/deleteAbl");

router.get("/get", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update", UpdateAbl);
router.post("/delete", DeleteAbl);

module.exports = router;
