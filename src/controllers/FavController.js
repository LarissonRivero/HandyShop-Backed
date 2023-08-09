const FavModel = require('../models/FavModel');
const {enviarRespuestaExitosa, enviarRespuestaError, enviarRespuestaNoEncontrado} = require('../middlewares/response');


const addFav = async (req, res) => {
    try {
        const { id_usuario, id_servicio } = req.body;
        console.log(id_usuario, id_servicio);
        const resultado = await FavModel.agregarFavorito(id_usuario, id_servicio);
        enviarRespuestaExitosa(res, resultado);
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al añadir a favoritos');
    }
};

//Get para obtener los favoritos de los usuarios con validacion de token y middleware
const getFav = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const resultado = await FavModel.obtenerFavoritos(id_usuario);
        enviarRespuestaExitosa(res, resultado);
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al obtener los favoritos');
    }
};

//DELETE  eliminar favoritos con id de usuario e id de favorito con validacion de token y middleware

const deleteFav = async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const id_servicio = req.params.id_servicio;
        const resultado = await FavModel.eliminarFavorito(id_usuario, id_servicio);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Favorito eliminado correctamente');
        } else {
            enviarRespuestaNoEncontrado(res, 'El favorito no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al eliminar el favorito');
    }
};

module.exports = {
    addFav,
    getFav,
    deleteFav
}