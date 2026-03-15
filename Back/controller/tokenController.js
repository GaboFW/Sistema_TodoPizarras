// require("dotenv").config();
// const { tokenValido } = require("../models/tokenModel");

// // Mercado Libre
// const getTokenML = async (req, res) => {
//     try {
//         let tokenData = await tokenValido();

//         // if (!tokenData) {
//         //     const tokenInicial = await MLToken();

//         //     if (tokenInicial.status === 200) {
//         //         return res.status(200).json(tokenInicial.body);
//         //     } else {
//         //         return res.status(tokenInicial.status).json(tokenInicial.body);
//         //     }
//         // }

//         return res.status(200).json(tokenData);
//     }
//     catch (error) {
//         res.status(500).json({
//             error: "Error en la obtención del token",
//             message: error.message
//         });
//     }
// }

// module.exports = {
//     getTokenML
// };