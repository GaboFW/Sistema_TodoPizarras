require("dotenv").config();
const { obtenerTokenValido } = require("../models/tokenModel");
const { getIdsML } = require("../models/mlModel");

// Tienda Nube
const getTiendaNube = async (req, res) => {
    try {
        const response = await fetch(`${process.env.TN_URI}/${process.env.TN_USER_ID}/products?page=1&per_page=200`, {
            method: "GET",
            headers: {
                "Authentication": `bearer ${process.env.TN_ACCESS_TOKEN}`,
                "User-Agent": `MyApp (${process.env.TN_AGENT_USER})`,
            }
        });

        const data = await response.json();

        if (response.ok) {
            return res.status(200).json(data);
        } else {
            return res.status(response.status).json(data);
        }
    } catch (error) {
        return res.status(500).json({error: "Error interno del servidor", message: error.message});
    }
}

// Mercado Libre
const chunkArray = (array, size) => {
    const chunked = [];

    for (let i = 0; i < array.length; i += size) {
        chunked.push(array.slice(i, i + size));
    }

    return chunked;
}

const getStockML = async (req, res) => {
    try {
        const accessToken = await obtenerTokenValido();

        const ids = await getIdsML(accessToken);

        if (!ids || ids.length === 0) {
            return res.status(200).json([]);
        }

        const tamanioArray = 20;
        const idArray = chunkArray(ids, tamanioArray);
        const attributes = "title,available_quantity";

        const promises = idArray.map(async (id) => {
            const idsString = id.join(",");
            const uri = `${process.env.ML_API_URL}/items?ids=${idsString}&attributes=${attributes}`;

            const response = await fetch(uri, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            if (!response) {
                return [];
            }

            return response.json();
        });

        const resultadosArray = await Promise.all(promises);

        const dataCompleta = resultadosArray.flat();

        const dataTransformada = dataCompleta.map(item => item.body);

        return res.status(200).json({ body: dataTransformada });
    } catch (error) {
        return res.status(500).json({ error: "Error interno del servidor", message: error.message });
    }
}

module.exports = {
    getTiendaNube,
    getStockML
}