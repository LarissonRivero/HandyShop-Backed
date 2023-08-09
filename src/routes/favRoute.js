const express = require("express");
const router = express.Router();
const FavController = require("../controllers/FavController");
const Auth = require("../middlewares/Auth");
const ValidarData = require("../middlewares/ValidarData");
const Log = require("../middlewares/Log");


router.post("/", Auth.verificarToken, ValidarData.middlewareVerificarFaritos, FavController.addFav);
router.get("/:id_usuario", Auth.verificarToken, Log.middlewareGetData ,FavController.getFav);
router.delete("/:id_usuario/:id_servicio", Auth.verificarToken, FavController.deleteFav);

module.exports = router;