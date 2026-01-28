require("dotenv").config();
const { getToken } = require("../utils/tokenRedis");
const { MLToken, MLRefreshToken } = require("../models/tokenModel");

// Mercado Libre
const getTokenML = async (req, res) => {
    try {
        let tokenData = await getToken();

        if (!tokenData) {
            const tokenInicial = await MLToken();

            if (tokenInicial.status === 200) {
                return res.status(200).json(tokenInicial.body);
            } else {
                return res.status(tokenInicial.status).json(tokenInicial.body);
            }

            const isExpired = !tokenData.expires_at || Date.now() > tokenData.expires_at;

            if (isExpired) {
                const refreshToken = await MLRefreshToken();

                if (refreshToken.status === 200) {
                    return res.status(200).json(refreshToken.body);
                } else {
                    return res.status(refreshToken.status).json(refreshToken.body);
                }
            }
        }

        return res.status(200).json(tokenData);
    }
    catch (error) {
        res.status(500).json({
            error: "Error en la obtención del token",
            message: error.message
        });
    }
}

module.exports = {
    getTokenML
};