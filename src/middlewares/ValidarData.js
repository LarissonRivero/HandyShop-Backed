const { verificarCredencialesEmail, obtenerUsuario } = require('../models/UsuariosModel');
const jwt = require('jsonwebtoken');
const {enviarRespuestaExitosa, enviarRespuestaError, enviarRespuestaNoEncontrado} = require('../middlewares/response');


const middlewareVerificarDatosForm = async (req, res, next) => {
    try {
        //si el rol viene vacio dejarlo por defecto en usuario
        if (!req.body.rol) {
            req.body.rol = "usuario";
        }
        const { nombre, apellido, email, direccion, password, telefono } = req.body;
        if (nombre && apellido && email && direccion && password && telefono) {
            next();
        }
        else {
            res.status(401).json('Datos incompletos');
        }
    }
    catch (error) {
        console.log(error);
    }
};

const middlewareVerificarCredencialesLogin = async (req, res, next) => {
    try {
        const { email } = req.body;
        const usuario = await verificarCredencialesEmail(email);
        if (!usuario) {
            return res.status(404).json('Usuario o contraseña incorrectos');
        }
        req.usuario = usuario;
        next();
    } catch (error) {
        res.status(500).json(error.message);
    }
};

const middlewareVerificarFormServicio = async (req, res, next) => {
    try {
        console.log(req.body);
        //consultar si el id_usuario existen los datos de la tabla servicios
        const { nombre_servicio, img_url, categoria, descripcion, monto, region,comuna } = req.body.servicio || req.body;
        if (nombre_servicio && img_url && categoria && descripcion && monto && region && comuna) {
            next();
        }

        else {
            res.status(401).json('Datos incompletos');
        }
    }
    catch (error) {
        console.log(error);
    }
};

const middlewareVerificarFaritos = async (req, res, next) => {
    try {
        const { id_servicio, id_usuario } = req.body;
        if (id_servicio && id_usuario) {
            next();
        }
        else {
            res.status(401).json('Datos incompletos');
        }
    }
    catch (error) {
        console.log(error);
    }
};
const middlewareValidarAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const id_usuario = payload.id_usuario;
        const usuario = await obtenerUsuario(id_usuario);
        if (usuario.rol === 'admin') {
            next();
        } else {
            throw { code: 403, message: 'No tienes permiso para realizar esta acción' };
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al validar el administrador', error.code || 500);
    }
};


const middlewareVerificarDatosPutUsuarios = async (req, res, next) => {
    try {
        //si el rol viene vacio dejarlo por defecto en usuario
        if (!req.body.rol) {
            req.body.rol = "usuario";
        }
        const { nombre, apellido,  direccion, telefono } = req.body;
        if (nombre && apellido  && direccion  && telefono) {
            next();
        }
        else {
            res.status(401).json('Datos incompletos');
        }
    }
    catch (error) {
        console.log(error);
    }
};


module.exports = {
    middlewareVerificarDatosForm,
    middlewareVerificarCredencialesLogin,
    middlewareVerificarFormServicio,
    middlewareVerificarFaritos,
    middlewareValidarAdmin,
    middlewareVerificarDatosPutUsuarios
    
};

