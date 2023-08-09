const pool = require('../Config/db');
const format = require('pg-format');

//agregar servicio a favoritos
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

//obtener favoritos por id de usuario
const obtenerFavoritos = async (id_usuario) => {
    try {
        //obtener todos los datos de los servicios favoritos de un usuario, el nombre y apellido del usuario que creo el servicio
        const formatedQuery = format('SELECT id_favorito, servicios.*, usuarios.nombre, usuarios.apellido FROM favoritos INNER JOIN servicios ON favoritos.id_servicio = servicios.id_servicio INNER JOIN usuarios ON servicios.id_usuario = usuarios.id_usuario WHERE favoritos.id_usuario = %L', id_usuario);
        const { rows } = await pool.query(formatedQuery);
        return rows;
    } catch (error) {
        throw error;
    }
};

// eliminar favorito por id de usuario y id de servicio
const eliminarFavorito = async (id_usuario, id_servicio) => {
    try {
        const formatedQuery = format('DELETE FROM favoritos WHERE id_usuario = %L AND id_servicio = %L', id_usuario, id_servicio);
        const { rowCount } = await pool.query(formatedQuery);
        return rowCount;
        console.log(rowCount);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    agregarFavorito,
    obtenerFavoritos,
    eliminarFavorito
};
