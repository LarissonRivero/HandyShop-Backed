const UsuariosModel = require('../models/UsuariosModel');
const {enviarRespuestaExitosa, enviarRespuestaError, enviarRespuestaNoEncontrado} = require('../middlewares/response');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

/* Post para agregar usuarios con validacion de datos y middleware */
const addUsuario = async (req, res) => {
    try {
        const usuarios = req.body;
        console.log(usuarios);
        const resultado = await UsuariosModel.nuevoUsuario(usuarios);
        res.json(resultado);
    } catch (error) {
        res.status(500).json(error.message);
    }
};

// GET para obtener los datos del usuario logeado con validacion de token y middleware
const getUsuario = async (req, res) => {
    const email = req.email;
    console.log("este es el email: " + email);
    const usuario = await UsuariosModel.verificarCredencialesEmail(email); // Solo se pasa el email como argumento
    if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const usuarioSinClave = {
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        direccion: usuario.direccion,
        telefono: usuario.telefono
    };
    res.json(usuarioSinClave);
};

/* Post logearse, esto verifica que el usuario exista y que la contraseña sea correcta */
const login = async (req, res) => {
    const { email, password } = req.body;
    const usuario = await UsuariosModel.verificarCredenciales(email, password);
    if (!usuario) {
        return res.status(404).json('Usuario o contraseña incorrectos');
    }
    const token = jwt.sign({ email: usuario.email }, process.env.SECRET_KEY);
    res.json({ token, usuario: { id_usuario: usuario.id_usuario, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, direccion: usuario.direccion, telefono: usuario.telefono } });
};

//DELETE  eliminar usuarios desde la cuenta de admin con validacion de token y middleware
const deleteUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await UsuariosModel.eliminarUsuario(id);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Usuario eliminado correctamente');
        } else {
            enviarRespuestaNoEncontrado(res, 'El usuario no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al eliminar el usuario');
    }
}

//PUT modificar usuarios con validacion de token y middleware
const modifyUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const datos = req.body;
        const resultado = await UsuariosModel.modificarUsuario(id, datos);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Usuario modificado correctamente');
        } else {
            enviarRespuestaNoEncontrado(res, 'El usuario no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al modificar el usuario');
    }
};


module.exports = {
    addUsuario,
    getUsuario,
    login,
    deleteUsuario,
    modifyUsuario
};
