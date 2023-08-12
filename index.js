const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const usuariosRoute = require('./src/routes/usuariosRoute');
const serviciosRoute = require('./src/routes/serviciosRoute');
const favRoute = require('./src/routes/favRoute');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Bienvenido a la API de servicios");
});

app.use("/usuarios", usuariosRoute);
app.use("/servicios", serviciosRoute);
app.use("/favoritos", favRoute);

app.listen(process.env.PORT, () => {
    console.log("\x1b[36m%s\x1b[0m", `Servidor corriendo en el puerto ${process.env.PORT}`);
}
);

module.exports = app;