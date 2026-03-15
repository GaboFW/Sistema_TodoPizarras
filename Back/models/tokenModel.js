// require("dotenv").config();
const { guardarToken, obtenerToken } = require("../utils/authKV");

const token = async () => {
    const bodyParams = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.ML_APP_ID,
        client_secret: process.env.ML_SECRET_KEY,
        code: process.env.ML_CODE,
        redirect_uri: process.env.ML_REDIRECT_URI
    });

    const response = await fetch(process.env.ML_URI_TOKEN, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyParams.toString()
    })

    const data = await response.json();

    if (!response.ok) {
        return { status: response.status, body: data };
    }

    return await guardarToken(data);
};

const renovarToken = async (refresh_token) => {
    const bodyParams = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: `${process.env.ML_APP_ID}`,
        client_secret: `${process.env.ML_SECRET_KEY}`,
        refresh_token: `${refresh_token}`
    });

    const response = await fetch(process.env.ML_URI_TOKEN, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: bodyParams.toString()
    })

    const data = await response.json();

    if (!response.ok) {
        return { status: response.status, body: data };
    }

    return await guardarToken(data);
}

const tokenValido = async () => {
    const datosJson = await obtenerToken();
    const ahora = Date.now();

    if (datosJson && datosJson.access_token && ahora < datosJson.expires_at) {
        return datosJson;
    }

    if (datosJson && datosJson.refresh_token) {
        try {
            return await renovarToken(datosJson.refresh_token);
        }
        catch (error) {
            throw new Error("Error al obtener el token", error);
        }
    }

    return await token();
}

module.exports = {
    tokenValido
};