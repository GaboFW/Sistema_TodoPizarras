const { getTiendaNube, getStockML } = require("../controllers/dataController");

const express = require("express");
const router = express.Router();

router.get("/tiendanube", getTiendaNube);
router.get("/mercadolibre", getStockML);

module.exports = router;