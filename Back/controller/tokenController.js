require("dotenv").config();
const { getToken } = require("../utils/tokenRedis");
const { MLToken, MLRefreshToken } = require("../models/tokenModel");

// Mercado Libre
const getTokenML = async (req, res) => {
    try {
        let tokenData = await getToken();

        if (!tokenData) {
            const initialResponse = await MLToken();

            if (initialResponse.status === 200) {
                return res.status(200).json(initialResponse.body);
            } else {
                return res.status(initialResponse.status).json(initialResponse.body);
            }
        }

        const isExpired = !tokenData.expires_at || Date.now() > tokenData.expires_at;

        if (isExpired) {
            const refreshResponse = await MLRefreshToken();

            if (refreshResponse.status === 200) {
                return res.status(200).json(refreshResponse.body);
            }
            else {
                return res.status(refreshResponse.status).json(refreshResponse.body);
            }
        }

        return res.status(200).json(tokenData);
    }
    catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ error: "Error interno obteniendo token" });
    }
}

module.exports = {
    getTokenML,
};