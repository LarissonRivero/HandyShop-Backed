const pool = require('../Config/db');
const format = require('pg-format');
const {enviarRespuestaExitosa, enviarRespuestaError, enviarRespuestaNoEncontrado} = require('../middlewares/response');

//crear un nuevo servicio
const nuevoServicio = async (servicio,id_usuario) => {
    try {
        let {  nombre_servicio, img_url, categoria, descripcion, monto, region, comuna } = servicio;
        let cantidad = 1;
        const formatedQuery = format('INSERT INTO servicios (id_usuario,nombre_servicio, img_url, categoria, descripcion, monto, region, comuna, cantidad) VALUES ( %L, %L, %L, %L, %L,%L, %L, %L, %L) RETURNING *', id_usuario,nombre_servicio, img_url, categoria, descripcion, monto, region, comuna, cantidad);
        const resultado = await pool.query(formatedQuery);
        if (resultado.rowCount === 1) {
            return "Servicio creado con exito";
        }
        else {
            return "Error al crear servicio";
        }
    }
    catch (error) {
        if (error.code === '23505') {
            return "El servicio ya existe";
        }
        else if (error.code === '23502') {
            return "Datos incompletos";
        }
        else if (error.code === '22P02') {
            return "Datos incorrectos";
        }
        else {
            console.log(error);
            return "Error al crear servicio";
        }
    }
};

//obtener un servicio por id
const getServiciosPorId = async (id) => {
    try {
        //obtner un servicios con limite  ademas de realizar un cruce con la tabla usuarios para obtener solo el nombre y apellido del usuario
        const formattedQuery = format('SELECT servicios.*, usuarios.nombre, usuarios.apellido , usuarios.telefono FROM servicios INNER JOIN usuarios ON servicios.id_usuario = usuarios.id_usuario WHERE id_servicio = %L limit 1', id);
        const { rows } = await pool.query(formattedQuery);
        return rows;
    } catch (error) {
        throw error;
    }
}

//obtener todos los servicios con limite y offset ademas de realizar un cruce con la tabla usuarios para obtener solo el nombre y apellido del usuario
const obtenerServicios = async ({ limits = 12, order_by = "id_servicio-ASC", page = 0 }) => {
    try {
        const [campo, orden] = order_by.split("-");
        const offset = (page - 1) * limits;
        //obtner todos los servicios con limite y offset ademas de realizar un cruce con la tabla usuarios para obtener solo el nombre y apellido del usuario
        const formattedQuery = format('SELECT servicios.*, usuarios.nombre, usuarios.apellido FROM servicios INNER JOIN usuarios ON servicios.id_usuario = usuarios.id_usuario ORDER BY %I %s LIMIT %L OFFSET %L', campo, orden, limits, offset);
        const result = await pool.query(formattedQuery);
        return result.rows;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//obtener la cantidad de servicios
const obtenerTotalServicios = async () => {
    try {
        const consulta = "SELECT COUNT(*) FROM servicios";
        const { rows } = await pool.query(consulta);
        return rows[0].count;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

//obtener los servicios creados por un usuario
const getServiciosPorIdUsuario = async (id_usuario) => {
    try {
        //obtener todos los datos de los servicios creados por un usuario, el nombre y apellido del usuario que creo el servicio
        const formatedQuery = format('SELECT servicios.*, usuarios.nombre, usuarios.apellido FROM servicios INNER JOIN usuarios ON servicios.id_usuario = usuarios.id_usuario WHERE servicios.id_usuario = %L', id_usuario);
        const { rows } = await pool.query(formatedQuery);
        return rows;
    } catch (error) {
        throw error;
    }
};

//obtener un servicio creado por un usuario por id de servicio y validando que el usuario sea el creador del servicio
const getServiciosPorIdUsuarioIdServicio = async (id_usuario, id_servicio) => {
    try {
        // Validar si el usuario es el creador del servicio
        const validarUsuarioQuery = format('SELECT COUNT(*) FROM servicios WHERE id_usuario = %L AND id_servicio = %L', id_usuario, id_servicio);
        const { rows: usuarioValido } = await pool.query(validarUsuarioQuery);

        if (usuarioValido[0].count === '1') {
            // Obtener el servicio por ID de servicio y ID de usuario
            const obtenerServicioQuery = format('SELECT servicios.*, usuarios.nombre, usuarios.apellido FROM servicios INNER JOIN usuarios ON servicios.id_usuario = usuarios.id_usuario WHERE servicios.id_usuario = %L AND servicios.id_servicio = %L', id_usuario, id_servicio);
            const { rows } = await pool.query(obtenerServicioQuery);

            if (rows.length > 0) {
                return rows;
            } else {
                throw { code: 404, message: "No se encontró el servicio" };
            }
        } else {
            throw { code: 403, message: "Acceso denegado: Usuario no es el creador del servicio o el servicio no existe" };
        }
    } catch (error) {
        throw error;
    }
};

const eliminarServicio = async (id_servicio, id_usuario) => {
    try {
        const formatedQuery = format('DELETE FROM servicios WHERE id_servicio = %L AND id_usuario = %L', id_servicio, id_usuario);
        const { rowCount } = await pool.query(formatedQuery);
        return rowCount > 0;
    } catch (error) {
        throw error;
    }
};

const modificarServicio = async (id_servicio, { nombre, descripcion, precio, categoria, metal, imagen }) => {
    try {
        const formatedQuery = format('UPDATE servicios SET nombre = %L, descripcion = %L, precio = %L, categoria = %L, metal = %L, imagen = %L WHERE id_servicio = %L RETURNING *', nombre, descripcion, precio, categoria, metal, imagen, id_servicio);
        const { rows } = await pool.query(formatedQuery);
        return rows[0];
    } catch (error) {
        throw error;
    }
};


module.exports = {
    nuevoServicio,
    getServiciosPorId,
    obtenerServicios,
    obtenerTotalServicios,
    getServiciosPorIdUsuario,
    getServiciosPorIdUsuarioIdServicio,
    eliminarServicio,
    modificarServicio
};
