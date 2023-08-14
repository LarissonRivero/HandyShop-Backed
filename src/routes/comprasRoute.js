const express = require("express");
const router = express.Router();
const ComprasController = require("../controllers/ComprasController");
const Auth = require("../middlewares/Auth");
const ValidarData = require("../middlewares/ValidarData");
const Log = require("../middlewares/Log");


router.post("/", Auth.verificarToken, ComprasController.addCompras);
router.get("/:id_usuario/:id_compra", Auth.verificarToken, Log.middlewareGetData ,ComprasController.getCompras);
router.get("/:id_usuario", Auth.verificarToken, Log.middlewareGetData ,ComprasController.getComprasUsuario);
/* router.delete("/:id_usuario/:id_servicio", Auth.verificarToken, ComprasController.deleteCompras);
 */
module.exports = router;