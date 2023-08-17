const pool = require('../config/db');
const bcrypt = require('bcryptjs')
const format = require('pg-format');

const nuevoUsuario = async (usuario) => {

    try {
        let { nombre, apellido, email, direccion, password, telefono, rol } = usuario;
        let passwordHash = bcrypt.hashSync(password);
        const formatedQuery = format('INSERT INTO usuarios (nombre, apellido, email, direccion, password, telefono, rol) VALUES ( %L, %L, %L, %L, %L,%L, %L) RETURNING *', nombre, apellido, email, direccion, passwordHash, telefono, rol);
        const resultado = await pool.query(formatedQuery);
        if (resultado.rowCount === 1) {
            return "Usuario creado con exito";
        }
        else {
            return "Error al crear usuario";
        }
    }
    catch (error) {
        if (error.code === '23505') {
            return "El usuario ya existe";
        }
        else if (error.code === '23502') {
            return "Datos incompletos";
        }
        else if (error.code === '22P02') {
            return "Datos incorrectos";
        }
        else {
            console.log(error);
            return "Error al crear usuario";
        }
    }

};

const eliminarUsuario = async (id_usuario) => {
    try {
        const formatedQuery = format('DELETE FROM usuarios WHERE id_usuario = %L', id_usuario);
        const { rowCount } = await pool.query(formatedQuery);
        return rowCount > 0;
    } catch (error) {
        throw error;
    }
};

const modificarUsuario = async (id_usuario, { nombre, apellido, telefono, direccion }) => {
    try {
        const formatedQuery = format('UPDATE usuarios SET nombre = %L, apellido = %L, telefono = %L, direccion = %L WHERE id_usuario = %L RETURNING *', nombre, apellido, telefono, direccion, id_usuario);
        const { rows } = await pool.query(formatedQuery);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!usuario || !passwordEsCorrecta) {
        return false;
    }
    else {
        console.log("banco de datos", usuario);
        return usuario;
    }
}

const verificarCredencialesEmail = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1";
    const value = [email]
    const { rows: [usuario] } = await pool.query(consulta, value);
    return usuario;
};

const modificarPass = async (id_usuario,  password ) => {
    try {
        //validar si el usuario existe en la base de datos
    
        let passwordHash = bcrypt.hashSync(password);
        const formatedQuery = format('UPDATE usuarios SET password = %L WHERE id_usuario = %L RETURNING *', passwordHash, id_usuario);
        const data = await pool.query(formatedQuery);
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;

    }
};






module.exports = {
    nuevoUsuario,
    eliminarUsuario,
    modificarUsuario,
    verificarCredenciales,
    verificarCredencialesEmail,
    modificarPass
};
