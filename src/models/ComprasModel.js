const pool = require('../config/db');
const format = require('pg-format');

//agregar servicio a favoritos
// Controlador para agregar una compra con varios servicios
const anadirCompra = async (data) => {
    const { id_usuario, servicios } = data;

    try {
        // Insertar la compra en la tabla de compras
        const compraResult = await pool.query(
            'INSERT INTO compras (id_usuario) VALUES ($1) RETURNING id_compra',
            [id_usuario]
        );
        const id_compra = compraResult.rows[0].id_compra;
        // Insertar los servicios asociados a la compra en la tabla compra_servicio
        const servicioValues = servicios.map(servicioId => `(${id_compra}, ${servicioId})`).join(',');
        const { rowCount } = pool.query(
            `INSERT INTO compra_servicio (id_compra, id_servicio) VALUES ${servicioValues}`
        );
        return compraResult.rows[0].id_compra;

    } catch (error) {
        console.log(error);
        throw error;
    }
};

// Controlador para obtener los servicios asociados a una compra por id_compra
const obtenerCompra = async (id_compra, id_usuario) => {
    try {
        // Consultar la base de datos para obtener los servicios asociados a la compra
        const result = await pool.query(
            'SELECT  c.id_compra,u.nombre, u.apellido, s.*  FROM servicios s ' +
            'INNER JOIN compra_servicio cs ON s.id_servicio = cs.id_servicio ' +
            'INNER JOIN compras c ON cs.id_compra = c.id_compra ' +
            'INNER JOIN usuarios u ON c.id_usuario = u.id_usuario ' +
            'WHERE c.id_compra = $1 AND c.id_usuario = $2',
            [id_compra, id_usuario]
        );

        const servicios = result.rows;
        return servicios;
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        throw new Error('Error al obtener servicios');
    }
};


// eliminar favorito por id de usuario y id de servicio
/*const obtenerComprasUsuario = async (id_usuario) => {
    try {
        // Consultar la base de datos para obtener los servicios asociados a la compra
         const result = await pool.query(
            'SELECT  c.id_compra,u.nombre, u.apellido, s.*  FROM servicios s ' +
            'INNER JOIN compra_servicio cs ON s.id_servicio = cs.id_servicio ' +
            'INNER JOIN compras c ON cs.id_compra = c.id_compra ' +
            'INNER JOIN usuarios u ON c.id_usuario = u.id_usuario ' +
            'WHERE c.id_usuario = $1',
            [id_usuario]
        ); 
        const result = await pool.query(
            'SELECT c.id_compra, ARRAY_AGG(s.id_servicio) AS id_servicios, ' +
            '(SELECT SUM(servicios.monto) FROM compra_servicio ' +
            'INNER JOIN servicios ON compra_servicio.id_servicio = servicios.id_servicio ' +
            'WHERE compra_servicio.id_compra = c.id_compra) AS total ' +
            'FROM compras c ' +
            'INNER JOIN compra_servicio cs ON c.id_compra = cs.id_compra ' +
            'INNER JOIN servicios s ON cs.id_servicio = s.id_servicio ' +
            'WHERE c.id_usuario = $1 ' +
            'GROUP BY c.id_compra',
            [id_usuario]
          );

        const servicios = result.rows;
        return servicios;
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        throw new Error('Error al obtener servicios');
    }
};*/
const obtenerComprasUsuario = async (id_usuario) => {
    try {
        const result = await pool.query(
            'SELECT c.id_compra, ARRAY_AGG(s.id_servicio) AS id_servicios, ' +
            '(SELECT SUM(servicios.monto) FROM compra_servicio ' +
            'INNER JOIN servicios ON compra_servicio.id_servicio = servicios.id_servicio ' +
            'WHERE compra_servicio.id_compra = c.id_compra) AS total ' +
            'FROM compras c ' +
            'INNER JOIN compra_servicio cs ON c.id_compra = cs.id_compra ' +
            'INNER JOIN servicios s ON cs.id_servicio = s.id_servicio ' +
            'WHERE c.id_usuario = $1 ' +
            'GROUP BY c.id_compra',
            [id_usuario]
        );
        const formattedCompras = [];
        for (const row of result.rows) {
            const serviciosResult = await pool.query(
                'SELECT servicios.*, usuarios.nombre, usuarios.apellido , usuarios.telefono  ' +
                'FROM servicios INNER JOIN usuarios ON servicios.id_usuario = usuarios.id_usuario ' +
                'WHERE id_servicio = ANY($1)',
                [row.id_servicios]
            );
            const servicios = serviciosResult.rows;
            const compra = {
                id_compra: row.id_compra,
                id_servicios: row.id_servicios,
                total: row.total,
                servicios: servicios
            };
            formattedCompras.push(compra);
        }
        return formattedCompras;
    } catch (error) {
        console.error('Error al obtener compras:', error);
        throw new Error('Error al obtener compras');
    }
};


module.exports = {
    obtenerCompra,
    anadirCompra,
    obtenerComprasUsuario
};
