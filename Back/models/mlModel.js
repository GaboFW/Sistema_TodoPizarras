require("dotenv").config();
const { obtenerTokenValido } = require("../models/tokenModel");

/**
 * Los productos con sus IDs
 */
const getIdsML = async (accessToken) => {
    let items = [];
    let scrollId = null;
    let hasMore = true;

    try {
        while (hasMore) {
            let url = `${process.env.ML_API_URI}/users/${process.env.ML_USER_ID}/items/search?search_type=scan&limit=100`;

            if (scrollId) {
                url += `&scroll_id=${scrollId}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            const data = await response.json();
            const ids = data.results;

            if (ids && ids.length > 0) {
                items = [...items, ...ids];

                scrollId = data.scroll_id;
            } else {
                hasMore = false;
            }
        }

        return items;

    } catch (error) {
        return { status: 500, body: { error: "Error interno obteniendo token" } };
    }
}

module.exports = {
    getIdsML
};