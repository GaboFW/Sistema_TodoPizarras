require("dotenv").config();
const express = require("express");
const cors = require("cors");

const tokenRoutes = require("./routes/tokenRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hola Mundo!");
});

app.use("/", tokenRoutes);

const port = 3000;
app.listen(port, () => console.log(`🚀 Servidor corriendo en http://localhost:${port}`));