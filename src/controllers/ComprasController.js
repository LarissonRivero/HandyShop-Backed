const ComprasModel = require('../models/ComprasModel');
const {enviarRespuestaExitosa, enviarRespuestaError, enviarRespuestaNoEncontrado} = require('../middlewares/response');


const addCompras = async (req, res) => {
    try {
        const data = req.body;
        const resultado = await ComprasModel.anadirCompra(data);
        enviarRespuestaExitosa(res, "se ha añadido la compra correctamente");
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al añadir la compra');
    }
};

//Get para obtener las compras de los usuarios con validacion de token y middleware
const getCompras = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const id_compra = req.params.id_compra;
        const resultado = await ComprasModel.obtenerCompra( id_compra, id_usuario);
        enviarRespuestaExitosa(res, resultado);
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al obtener los favoritos');
    }
};

//DELETE  eliminar favoritos con id de usuario e id de favorito con validacion de token y middleware

const getComprasUsuario = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        console.log(id_usuario);
        const resultado = await ComprasModel.obtenerComprasUsuario(id_usuario);
        if (resultado) {
            enviarRespuestaExitosa(res, resultado);
        } else {
            enviarRespuestaNoEncontrado(res, 'El favorito no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al eliminar el favorito');
    }
};

module.exports = {
    addCompras,
    getCompras,
    getComprasUsuario
}