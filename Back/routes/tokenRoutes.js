const { getTiendaNube } = require("../controller/tokenController");

const express = require("express");
const router = express.Router();

router.get("/", getTiendaNube);

module.exports = router;