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

// https://www.tiendanube.com/apps/(app_id)/authorize -> Tener acceso a la tienda de TodoPizarra

app.use("/tiendanube", tokenRoutes);

/*
https://auth.mercadolibre.com.ar/authorization
?response_type=code
&client_id=$APP_ID // -> id que me dio la app
&redirect_uri=$YOUR_URL // -> url de la redireccion que puse
&code_challenge=$CODE_CHALLENGE // -> contra > hash256(contra)
&code_challenge_method=$CODE_METHOD // -> S256
*/

app.post("/token", (req, res) => {
    const code = req.query.code;

    fetch("https://api.mercadolibre.com/oauth/token", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        // TOKEN
        body: new URLSearchParams({
            "grant_type": "authorization_code",
            "client_id": process.env.CLIENT_ID,
            "client_secret": process.env.CLIENT_SECRET,
            "code": process.env.CODE,
            "redirect_uri": process.env.REDIRECT_URI,
            "code_verifier": process.env.CODE_VERIFIER
        })
        // REFRESH TOKEN
        // body: new URLSearchParams({
        //     "grant_type": "refresh_token",
        //     "client_id": process.env.CLIENT_ID,
        //     "client_secret": process.env.CLIENT_SECRET,
        //     "refresh_token": process.env.REFRESH_TOKEN
        // })

        // (error.invalid_grant)
    })
        .then(response => response.json())
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error en el fetch:', error);
            res.status(500).json({ error: 'Error con los datos del fetch' });
        });
});

app.get("/buscar", (req, res) => {
    const code = req.query.code;

    fetch("https://api.mercadolibre.com/users/me", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${code}`
        }
    })
        .then(response => response.json())
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Error en el fetch:', error);
            res.status(500).json({ error: 'Error con los datos del fetch' });
        });
});

const port = 3000;
app.listen(port, () => console.log(`🚀 Servidor corriendo en http://localhost:${port}`));