const express = require("express");
const router = express.Router();
const ServiciosController = require("../controllers/ServiciosController");
const Auth = require("../middlewares/Auth");
const ValidarData = require("../middlewares/ValidarData");
const Log = require("../middlewares/Log");

//quiero poner un hola mundo en el get
router.get("/filter", Log.middlewareGetData, ServiciosController.getServiciosFiltros);
router.post("/", Auth.verificarToken, ValidarData.middlewareVerificarFormServicio, ServiciosController.addServicio);
router.get("/:id",  Log.middlewareGetData, ServiciosController.getServiciosPorIdServicio);
router.get("/",  Log.middlewareGetData, ServiciosController.getServiciosPagination);
router.get("/usuario/:id", Auth.verificarToken, Log.middlewareGetData, ServiciosController.getServiciosPorIdUsuario); 
router.get("/usuario/:id_usuario/:id_servicio", Auth.verificarToken, Log.middlewareGetData, ServiciosController.getServiciosPorIdUsuarioidServicio);  
router.delete("/:id_usuario/:id_servicio", Auth.verificarToken, ServiciosController.eliminarServicio);    
router.put("/:id", Auth.verificarToken, ValidarData.middlewareVerificarFormServicio,ServiciosController.modificarServicio);




module.exports = router;
