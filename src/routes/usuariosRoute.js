const express = require("express");
const router = express.Router();
const UsuariosController = require("../controllers/UsuariosController");
const Auth = require("../middlewares/Auth");
const ValidarData = require("../middlewares/ValidarData");
const Log = require("../middlewares/Log");

router.post("/", ValidarData.middlewareVerificarDatosForm, UsuariosController.addUsuario);  
router.post("/login", ValidarData.middlewareVerificarCredencialesLogin, UsuariosController.login);
router.get("/", Auth.verificarToken, Log.middlewareGetData, UsuariosController.getUsuario);
router.delete("/:id", Auth.verificarToken, UsuariosController.deleteUsuario);
router.put("/:id", Auth.verificarToken, UsuariosController.modifyUsuario);

module.exports = router;