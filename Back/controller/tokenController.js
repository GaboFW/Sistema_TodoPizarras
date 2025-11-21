require("dotenv").config();

// Tienda Nube
const getTiendaNube = (req, res) => {
    fetch(`${process.env.TN_URI}/${process.env.TN_USER_ID}/products`, {
        method: "GET",
        headers: {
            "Authentication": `bearer ${process.env.TN_ACCESS_TOKEN}`,
            "User-Agent": `Ejemplo (${process.env.TN_AGENT_USER})`, // Ejemplo -> Se cambia por el que me da la app
        }
    })
        .then(response => response.json())
        .then(data => {
            res.status(201).json(data);
        })
        .catch(error => {
            console.error('Error en el fetch:', error);
            res.status(500).json({ error: 'Error con los datos' });
        });
}

module.exports = {
    getTiendaNube
};