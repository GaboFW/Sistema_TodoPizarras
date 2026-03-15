const { getTiendaNube, getStockML } = require("../controller/dataController");

const express = require("express");
const router = express.Router();

router.get("/tiendanube", getTiendaNube);
router.get("/mercadolibre", getStockML);

module.exports = router;