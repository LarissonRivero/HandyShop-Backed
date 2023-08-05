const { Pool } = require('pg');
const bcrypt = require('bcryptjs')
const format = require('pg-format');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    allowExitOnIdle: true,
});



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

const agregarFavorito = async (id_usuario, id_servicio) => {
    try {
        const consultaRevision = 'SELECT * FROM favoritos WHERE id_usuario = $1 AND id_servicio = $2';
        const valores = [id_usuario, id_servicio];
        const { rows } = await pool.query(consultaRevision, valores);
        if (rows.length > 0) {
            throw { code: 400, message: "El servicio ya está en favoritos" };
        }
        const consulta = 'INSERT INTO favoritos (id_usuario, id_servicio) VALUES ($1, $2) RETURNING *';
        const { rows: [favorito] } = await pool.query(consulta, valores);
        return favorito;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

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

//GET servicios con filtro por categoria, ubicacion, monto  

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

const obtenerServiciosfiltro = async ({ precio_max, precio_min = 0, categoria, metal }) => {
    try {
        let filtros = [];
        if (precio_max) filtros.push(`precio <= ${precio_max}`);
        if (precio_min) filtros.push(`precio >= ${precio_min}`);
        if (categoria) filtros.push(`categoria = '${categoria}'`);
        if (metal) filtros.push(`metal = '${metal}'`);
        let consulta = "SELECT * FROM inventario";
        if (filtros.length > 0) {
            consulta += " WHERE " + filtros.join(" AND ");
        }
        const result = await pool.query(consulta);
        return (result.rows);
    } catch (error) {
        console.log(error);
    }
};

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

//obtener favoritos por id de usuario
const obtenerFavoritos = async (id_usuario) => {
    try {
        //obtener todos los datos de los servicios favoritos de un usuario, el nombre y apellido del usuario que creo el servicio
        const formatedQuery = format('SELECT servicios.*, usuarios.nombre, usuarios.apellido FROM favoritos INNER JOIN servicios ON favoritos.id_servicio = servicios.id_servicio INNER JOIN usuarios ON servicios.id_usuario = usuarios.id_usuario WHERE favoritos.id_usuario = %L', id_usuario);
        const { rows } = await pool.query(formatedQuery);
        return rows;
    } catch (error) {
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
const getServiciosPorIdUsuarioServicio = async (id_usuario, id_servicio) => {
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
    



// eliminar favorito por id de usuario y id de servicio


const eliminarFavorito = async (id_usuario, id_servicio) => {
    try {
        const formatedQuery = format('DELETE FROM favoritos WHERE id_usuario = %L AND id_servicio = %L', id_usuario, id_servicio);
        const { rowCount } = await pool.query(formatedQuery);

        if (rowCount > 0) {
            // Realiza una consulta adicional para obtener información sobre el favorito eliminado
            const selectQuery = format('SELECT * FROM favoritos WHERE id_usuario = %L AND id_servicio = %L', id_usuario, id_servicio);
            const { rows } = await pool.query(selectQuery);

            return rows[0]; // Devuelve la información del favorito eliminado
        } else {
            return null; // No se eliminó ningún favorito
        }

    } catch (error) {
        throw error;
    }
};

// eliminar servicio por id de servicio y id de usuario

const eliminarServicio = async (id_servicio, id_usuario) => {
    try {
        const formatedQuery = format('DELETE FROM servicios WHERE id_servicio = %L AND id_usuario = %L', id_servicio, id_usuario);
        const { rowCount } = await pool.query(formatedQuery);
        return rowCount > 0;
    } catch (error) {
        throw error;
    }
};


//eleminar usuario por id de usuario

const eliminarUsuario = async (id_usuario) => {
    try {
        const formatedQuery = format('DELETE FROM usuarios WHERE id_usuario = %L', id_usuario);
        const { rowCount } = await pool.query(formatedQuery);
        return rowCount > 0;
    } catch (error) {
        throw error;
    }
};

//modificar servicio por id de servicio

const modificarServicio = async (id_servicio, { nombre, descripcion, precio, categoria, metal, imagen }) => {
    try {
        const formatedQuery = format('UPDATE servicios SET nombre = %L, descripcion = %L, precio = %L, categoria = %L, metal = %L, imagen = %L WHERE id_servicio = %L RETURNING *', nombre, descripcion, precio, categoria, metal, imagen, id_servicio);
        const { rows } = await pool.query(formatedQuery);
        return rows[0];
    } catch (error) {
        throw error;
    }
};

//modificar usuario por id de usuario ademas de la contraseña

const modificarUsuario = async (id_usuario, { nombre, apellido, email, password, telefono, imagen }) => {
    try {
        const formatedQuery = format('UPDATE usuarios SET nombre = %L, apellido = %L, email = %L, password = %L, telefono = %L, imagen = %L WHERE id_usuario = %L RETURNING *', nombre, apellido, email, password, telefono, imagen, id_usuario);
        const { rows } = await pool.query(formatedQuery);
        return rows[0];
    } catch (error) {
        throw error;
    }
};



/* const obtenerServiciosFiltro = async ({ monto_max, monto_min, categoria, ubicacion }) => {
    try {
        let filtros = [];
        if (monto_max) filtros.push(`monto <= ${monto_max}`);
        if (monto_min) filtros.push(`monto >= ${monto_min}`);
        if (categoria) filtros.push(`categoria = '${categoria}'`);
        if (ubicacion) filtros.push(`ubicacion = '${ubicacion}'`);
        console.log(filtros);
        let consulta = "SELECT * FROM servicios";
        if (filtros.length > 0) {
            consulta += " WHERE " + filtros.join(" AND ");
        }

        console.log("Consulta generada:", consulta);

        const result = await pool.query(consulta);
        return result.rows;
    } catch (error) {
        console.log(error);
    }
};
 */



/* 
const nuevoServicio = async (
    name_service,
    image,
    description,
    price,
    location,
    category,
    id_user
  ) => {
    const query =
      "INSERT INTO producto VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7)";
    const values = [
        name_service,
        image,
        description,
        price,
        location,
        category,
        id_user
    ];
    const result = await pool.query(query, values);
    return result;
  };
 */

module.exports = {
    nuevoUsuario,
    verificarCredenciales,
    nuevoServicio,
    verificarCredencialesEmail,
    agregarFavorito,
    getServiciosPorId,
    obtenerServicios,
    obtenerServiciosfiltro,
    obtenerTotalServicios,
    obtenerFavoritos,
    eliminarFavorito,
    eliminarServicio,
    eliminarUsuario,
    modificarServicio,
    modificarUsuario,
    getServiciosPorIdUsuario,
    getServiciosPorIdUsuarioServicio
    /* obtenerServiciosFiltro */
}