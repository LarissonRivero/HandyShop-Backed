const ServiciosModel = require('../models/ServiciosModel');
const {enviarRespuestaExitosa, enviarRespuestaError, enviarRespuestaNoEncontrado} = require('../middlewares/response');


// Post para agregar servicios con validacion de token y middleware
const addServicio = async (req, res) => {
    try {
        const servicio = req.body || req.body.headers.servicio;
        console.log(servicio);
        const id_usuario = servicio.id_usuario || req.body.headers.id_usuario;
        console.log(id_usuario);
        const resultado = await ServiciosModel.nuevoServicio(servicio, id_usuario);
        enviarRespuestaExitosa(res, resultado);
    } catch (error) {
        enviarRespuestaError(res, error.message, error.code);
    }
}

// GET para obtener los datos de los servicios por id con validacion de token y middleware
const getServiciosPorIdServicio = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        const servicio = await ServiciosModel.getServiciosPorId(id);
        if (!servicio) {
            enviarRespuestaNoEncontrado(res, "Servicio no encontrado");
            return;
        }
        enviarRespuestaExitosa(res, servicio);
    } catch (error) {
        enviarRespuestaError(res, error.message, error.code);
        }
};


//Get para obtener los datos de los servicios con paginacion y ordenamiento con validacion  y middleware

const getServiciosPagination = async (req, res) => {
    try {
        const { limits, order_by, page } = req.query;

        let parsedPage = parseInt(page) || 1;
        if (parsedPage < 1) {
            throw { code: 400, message: "La página debe ser un número mayor a 0" };
        }

        let parsedLimits = parseInt(limits) || 12;
        if (parsedLimits < 1) {
            throw { code: 400, message: "El límite debe ser un número mayor a 0" };
        }

        let [campo, orden] = ["id_servicio", "ASC"];
        const camposValidos = ["id_servicio", "nombre_servicio", "categoria", "monto", "ubicacion", "fecha_registro"];
        if (order_by !== undefined) {
            [campo, orden] = order_by.split("-");
            if (orden !== "ASC" && orden !== "DESC") {
                throw { code: 400, message: "El orden debe ser ASC o DESC" };
            }
            if (!camposValidos.includes(campo)) {
                throw { code: 400, message: "El campo no es válido" };
            }
        }

        const result = await ServiciosModel.obtenerServicios({ limits: parsedLimits, order_by: `${campo}-${orden}`, page: parsedPage });
        const total = await ServiciosModel.obtenerTotalServicios();
        const totalPaginas = Math.ceil(total / parsedLimits);
        const hateoas = {
            first: `/servicios?limits=${parsedLimits}&order_by=${campo}-${orden}&page=1`,
            prev: `/servicios?limits=${parsedLimits}&order_by=${campo}-${orden}&page=${parsedPage - 1}`,
            next: `/servicios?limits=${parsedLimits}&order_by=${campo}-${orden}&page=${parsedPage + 1}`,
            last: `/servicios?limits=${parsedLimits}&order_by=${campo}-${orden}&page=${totalPaginas}`,
            serviciosTotal: total,
            totalPaginas: totalPaginas
        };

        enviarRespuestaExitosa(res, { result, hateoas });
    } catch (error) {
        enviarRespuestaError(res, error.message, error.code || 500);
    }
};


//Get para obtener los servicios de un usuario con validacion de token y middleware
const getServiciosPorIdUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const servicio = await ServiciosModel.getServiciosPorIdUsuario(id);
        // validar que no existe ningun servicio con de ese usuario e indicar que este no tine servicios
        if (!servicio) {
                enviarRespuestaNoEncontrado(res, "Servicio no encontrado", 404);
        }
        enviarRespuestaExitosa(res, servicio);
    } catch (error) {   
        enviarRespuestaError(res, error.message, error.code);    }
};


//get para obtener un servicio por id pertececiente a un usuario con validacion de token y middleware
const getServiciosPorIdUsuarioidServicio = async (req, res) => {
try {
        const id_usuario = req.params.id_usuario;
        const id_servicio = req.params.id_servicio;
        const servicio = await ServiciosModel.getServiciosPorIdUsuarioServicio(id_usuario, id_servicio);
        // validar que no existe ningun servicio con de ese usuario e indicar que este no tine servicios
        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }
        res.json(servicio);
    } catch (error) {
        enviarRespuestaError(res, error.message, error.code);    }
};


//DELETE para eliminar un servicio por id con validacion de token y middleware
const eliminarServicio = async (req, res) => {
    try {
        const id_servicio = req.params.id_servicio;
        const id_usuario = req.params.id_usuario;
        console.log(id_servicio, id_usuario);
        const resultado = await ServiciosModel.eliminarServicio(id_servicio, id_usuario);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Servicio eliminado correctamente',resultado);
        } else {
            enviarRespuestaNoEncontrado(res, 'El servicio no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al eliminar el servicio');
    }
};


//PUT modificar servicios con validacion de token y middleware
const modificarServicio = async (req, res) => {
try {
        const id = req.params.id;
        const datos = req.body;
        const resultado = await ServiciosModel.modificarServicio(id, datos);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Servicio modificado correctamente');
        } else {
            enviarRespuestaNoEncontrado(res, 'El servicio no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al modificar el servicio');
    }
};

module.exports = {
    addServicio,
    getServiciosPorIdServicio,
    getServiciosPorIdUsuario,
    getServiciosPorIdUsuarioidServicio,
    getServiciosPagination,
    eliminarServicio,
    modificarServicio
}
