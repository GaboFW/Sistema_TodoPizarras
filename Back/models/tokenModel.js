require("dotenv").config();
const { guardarToken, getToken } = require("../utils/tokenRedis");

const MLToken = async () => {
    const bodyParams = new URLSearchParams();
    bodyParams.append("grant_type", "authorization_code");
    bodyParams.append("client_id", `${process.env.ML_CLIENT_ID}`);
    bodyParams.append("client_secret", `${process.env.ML_CLIENT_SECRET}`);
    bodyParams.append("code", `${process.env.ML_CODE}`);
    bodyParams.append("redirect_uri", `${process.env.ML_REDIRECT_URI}`);

    try {
        const response = await fetch(process.env.ML_URI_TOKEN, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: bodyParams.toString()
        });

        const data = await response.json();

        if (!response.ok) {
            return { status: response.status, body: data };
        }

        await guardarToken(data);

        return { status: 200, body: data };

    } catch (error) {
        throw error;
    }
}

const MLRefreshToken = async () => {
    const dataJson = await getToken();

    if (!dataJson) {
        throw new Error("No se encontraron datos en Redis");
    }

    const bodyParams = new URLSearchParams();
    bodyParams.append("grant_type", "refresh_token");
    bodyParams.append("client_id", `${process.env.ML_CLIENT_ID}`);
    bodyParams.append("client_secret", `${process.env.ML_CLIENT_SECRET}`);
    bodyParams.append("refresh_token", `${dataJson.refresh_token}`);

    try {
        const response = await fetch(process.env.ML_URI_TOKEN, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: bodyParams.toString()
        });

        const data = await response.json();

        if (!response.ok) {
            return { status: response.status, body: data };
        }

        await guardarToken(data);

        return { status: 200, body: data };

    } catch (error) {
        throw error;
    }
}

const obtenerTokenValido = async () => {
    let tokenData = await getToken();

    if (!tokenData) {
        const initResponse = await MLToken();

        if (initResponse.status === 200) {
            return initResponse.body.access_token;
        } else {
            throw new Error(`No hay token almacenado y falló el login inicial: ${JSON.stringify(initResponse.body)}`);
        }
    }

    const isExpired = !tokenData.expires_at || Date.now() > tokenData.expires_at;

    if (isExpired) {
        console.log("Token vencido. Refrescando...");
        const refreshResponse = await MLRefreshToken();

        if (refreshResponse.status === 200) {
            return refreshResponse.body.access_token;
        } else {
            throw new Error("No se pudo refrescar el token: " + JSON.stringify(refreshResponse.body));
        }
    }

    return tokenData.access_token;
};

module.exports = {
    MLToken,
    MLRefreshToken,
    obtenerTokenValido
};