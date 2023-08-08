const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    allowExitOnIdle: true,
});

pool.on('connect', () => {console.log('successfull connection to database')});

// Manejo de errores de conexión
pool.on('error', (err) => {console.error('Unexpected error on idle client', err);});


module.exports = pool;