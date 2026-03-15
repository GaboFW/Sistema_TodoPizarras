const accountID = process.env.KV_ACCOUNT_ID;
const namespaceID = process.env.KV_NAMESPACE_ID;
const apiToken = process.env.KV_API_TOKEN;
const urlKV = process.env.KV_URL;
const llave = process.env.KV_NAMESPACE;

const guardarToken = async (datos) => {
    const url = `${urlKV}/accounts/${accountID}/storage/kv/namespaces/${namespaceID}/values/${llave}`;

    const expiresAt = Date.now() + (datos.expires_in * 1000) - 600000;

    const datosGuardar = {
        ...datos,
        expires_at: expiresAt
    };

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-type": "text/plain"
            },
            body: JSON.stringify(datosGuardar)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("Detalle del error de Cloudflare KV:", JSON.stringify(errorBody, null, 2));
            throw new Error(`Error al guardar el token en Cloudflare KV: ${response.statusText}`);
        }

        return datosGuardar;
    }
    catch (error) {
        throw new Error(`Error al guardar el token en Cloudflare KV: ${error.message}`);
    }
};

const obtenerToken = async () => {
    const url = `${urlKV}/accounts/${accountID}/storage/kv/namespaces/${namespaceID}/values/${llave}`;

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${apiToken}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.text();
        const results = JSON.parse(data);

        return results;
    }
    catch (error) {
        console.error("Error al obtener el token:", error);

        throw error;
    }
}

module.exports = {
    guardarToken,
    obtenerToken
};