const { nuevoUsuario,
    verificarCredenciales,
    verificarCredencialesEmail,
    nuevoServicio,
    agregarFavorito,
    getServiciosPorId,
    obtenerServicios,
    obtenerTotalServicios,
    obtenerFavoritos,
    eliminarFavorito,
    eliminarServicio,
    eliminarUsuario,
    modificarServicio,
    modificarUsuario,
    obtenerServiciosFiltro } = require('./consultas');
const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();
require('dotenv').config();
const cors = require('cors');

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
app.use(cors());
app.use(express.json());

/* middleware Verificar que esten todos los datos del formulario */
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

/* Middleware Verificar Credenciales Login */

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

//middleware para validar token
const middlewareValidarToken = (req, res, next) => {
    try {
        let Authorization = req.header("Authorization");
        //si no encuentra nada en req.headrer("Authorization") que busque en req.body.headers.Authorization
        if (!Authorization) {
            Authorization = req.body.headers.Authorization;
        }
        if (!Authorization) {
            return res.status(401).json('Sin token');
        }
        const token = Authorization.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json('Sin token');
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json('Token inválido');
            }
            req.email = decoded.email; // Asegúrate de que el token incluya la propiedad 'email'
            next();
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};




// agregar post de productos con validacion de token y middleware 
const middlewareVerificarFormServicio = async (req, res, next) => {
    try {
        console.log(req.body.headers.servicio);
        //si el rol viene vacio dejarlo por defecto en usuario
        const { nombre_servicio, img_url, categoria, descripcion, monto, region, comuna } = req.body.headers.servicio;
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

//middleware para validar favoritos

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

const middlewareGetServicios = async (req, res, next) => {
    try {
        const queryStrings = req.query;
        const url = req.url;
        console.log(`
    Se realizó una consulta a la base de datos
    Fecha: ${new Date().toLocaleString()}
    URL: ${url.split("?")[0]}
    queryStrings: ${JSON.stringify(queryStrings)}
    `);
        next();
    } catch (error) {
        res.status(500).json(error);
    }
};


/* Post para agregar usuarios con validacion de datos y middleware */

app.post('/usuarios', middlewareVerificarDatosForm, async (req, res) => {
    try {
        const usuarios = req.body;
        console.log(usuarios);
        const resultado = await nuevoUsuario(usuarios);
        res.json(resultado);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

/* Post logearse, esto verifica que el usuario exista y que la contraseña sea correcta */

app.post('/login', middlewareVerificarCredencialesLogin, async (req, res) => {
    const { email, password } = req.body;
    const usuario = await verificarCredenciales(email, password);
    if (!usuario) {
        return res.status(404).json('Usuario o contraseña incorrectos');
    }
    const token = jwt.sign({ email: usuario.email }, process.env.SECRET_KEY);
    res.json({ token, usuario: { id_usuario: usuario.id_usuario, email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, direccion: usuario.direccion, telefono: usuario.telefono } });
});

// GET para obtener los datos del usuario logeado con validacion de token y middleware
app.get('/usuarios', middlewareValidarToken, async (req, res) => {
    const email = req.email;
    console.log("este es el email: " + email);
    const usuario = await verificarCredencialesEmail(email); // Solo se pasa el email como argumento
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

});


// Post para agregar servicios con validacion de token y middleware
app.post('/servicios', middlewareVerificarFormServicio, middlewareValidarToken, async (req, res) => {
    try {
        const servicio = req.body.headers.servicio;
        console.log(servicio);
        const id_usuario = req.body.headers.id_usuario;
        console.log(id_usuario);
        const resultado = await nuevoServicio(servicio, id_usuario);
        res.json(resultado);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// Post Favoritos para guardar los favoritos de los usuarios con validacion de token y middleware
app.post('/favoritos', middlewareVerificarFaritos, middlewareValidarToken, async (req, res) => {
    try {
        const { id_usuario, id_servicio } = req.body;
        console.log(id_usuario, id_servicio);
        const resultado = await agregarFavorito(id_usuario, id_servicio);
        res.json(resultado);
    } catch (error) {
        res.status(500).json(error.message);
    }
});

// GET para obtener los datos de los servicios por id con validacion de token y middleware
app.get('/servicios/:id', middlewareGetServicios, async (req, res) => {
    try {
        const id = req.params.id;
        const servicio = await getServiciosPorId(id);
        if (!servicio) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }
        res.json(servicio);
    } catch (error) {
        res.status(500).json(error.message);
    }
});



//Get para obtener los datos de los servicios con paginacion y ordenamiento con validacion de token y middleware

app.get('/servicios', middlewareGetServicios, async (req, res) => {
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

        const result = await obtenerServicios({ limits: parsedLimits, order_by: `${campo}-${orden}`, page: parsedPage });
        const total = await obtenerTotalServicios();
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
});



//crear una ruta get para obtener todos los datos de la tabla consulta aplicando filtros
/* app.get('/servicios/filtros', middlewareGetServicios, async (req, res) => {
    try {
        const queryStrings = req.query;

        // Validar y obtener los valores de los filtros
        const monto_max = parseFloat(queryStrings.monto_max);
        const monto_min = parseFloat(queryStrings.monto_min) || 0;
        const categoria = queryStrings.categoria;
        const ubicacion = queryStrings.ubicacion;

        if ((isNaN(monto_max) && isNaN(monto_min)) || (monto_max < monto_min)) {
            throw { code: 400, message: "Valores de monto inválidos" };
        }

        if (!monto_max && !monto_min && !categoria && !ubicacion) {
            throw { code: 400, message: "Debes proporcionar al menos un filtro" };
        }

        const result = await obtenerServiciosFiltro({ monto_max, monto_min, categoria, ubicacion });
        enviarRespuestaExitosa(res, result);
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al obtener los servicios con filtros', error.code || 500);
    }
}); */



//Get para obtener los favoritos de los usuarios con validacion de token y middleware
app.get('/favoritos/:id_usuario', middlewareValidarToken, middlewareGetServicios, async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const resultado = await obtenerFavoritos(id_usuario);
        enviarRespuestaExitosa(res, resultado);
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al obtener los favoritos');
    }
});


//DELETE  eliminar favoritos con id de usuario e id de favorito con validacion de token y middleware

app.delete('/favoritos/:id_usuario/:id_servicio', middlewareValidarToken, middlewareGetServicios, async (req, res) => {
    try {
        const id_usuario = req.params.id_usuario;
        const id_servicio = req.params.id_servicio;
        const resultado = await eliminarFavorito(id_usuario, id_servicio);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Favorito eliminado correctamente');
        } else {
            enviarRespuestaNoEncontrado(res, 'El favorito no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al eliminar el favorito');
    }
});


//DELETE  eliminar servicios con id de servicio e id de usuario con validacion de token y middleware

app.delete('/servicios/:id_servicio/:id_usuario', middlewareValidarToken, middlewareGetServicios, async (req, res) => {
    try {
        const id_servicio = req.params.id_servicio;
        const id_usuario = req.params.id_usuario;
        console.log(id_servicio, id_usuario);
        const resultado = await eliminarServicio(id_servicio, id_usuario);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Servicio eliminado correctamente',resultado);
        } else {
            enviarRespuestaNoEncontrado(res, 'El servicio no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al eliminar el servicio');
    }
});
//middleware para validar si es administrador 

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

//DELETE  eliminar usuarios desde la cuenta de admin con validacion de token y middleware

app.delete('/usuarios/:id', middlewareValidarToken, middlewareValidarAdmin, middlewareGetServicios, async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await eliminarUsuario(id);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Usuario eliminado correctamente');
        } else {
            enviarRespuestaNoEncontrado(res, 'El usuario no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al eliminar el usuario');
    }
});


//PUT modificar servicios con validacion de token y middleware

app.put('/servicios/:id', middlewareValidarToken, middlewareVerificarFormServicio, middlewareGetServicios, async (req, res) => {
    try {
        const id = req.params.id;
        const datos = req.body;
        const resultado = await modificarServicio(id, datos);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Servicio modificado correctamente');
        } else {
            enviarRespuestaNoEncontrado(res, 'El servicio no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al modificar el servicio');
    }
});

//PUT modificar usuarios con validacion de token y middleware

app.put('/usuarios/:id', middlewareValidarToken, middlewareVerificarDatosForm, middlewareGetServicios, async (req, res) => {
    try {
        const id = req.params.id;
        const datos = req.body;
        const resultado = await modificarUsuario(id, datos);
        if (resultado) {
            enviarRespuestaExitosa(res, 'Usuario modificado correctamente');
        } else {
            enviarRespuestaNoEncontrado(res, 'El usuario no fue encontrado');
        }
    } catch (error) {
        enviarRespuestaError(res, 'Ha ocurrido un error al modificar el usuario');
    }
});







const enviarRespuestaExitosa = (res, mensaje) => {
    res.status(200).json({ mensaje });
};

const enviarRespuestaError = (res, mensaje, estado = 500) => {
    res.status(estado).json({ mensaje });
};

const enviarRespuestaNoEncontrado = (res, mensaje) => {
    enviarRespuestaError(res, mensaje, 404);
};



/* headers
:
Authorization
:
"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY5MTA5MzY4MH0.3HEJ7EZSssjAxxDGGXkJtqQ4hCQwn7HS4V-i-KSnlDI"
id_usuario
:
"1"
servicio
:
categoria
:
"Industrial"
comuna
:
"Lo Espejo"
descripcion
:
"test111"
img_url
:
"test1"
monto
:
"1234"
nombre_servicio
:
"test1"
region
:
"Metropolitana"

 */






/* eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRpZWdvQGdtYWlsLmNvbSIsImlhdCI6MTY5MDk0MzAyN30.GjGsgGHKwO0OH-wDNdVHDun1UYLXweAdrp9sYYkLFQ0 */


//POST http://localhost:3000/usuarios
//ejemplo de un json para el primer post de usuarios
/* {
    "nombre": "Diego",
    "apellido": "Carvajal",
    "email": "diego@gmail.com",
    "direccion": "Av. Siempre Viva 123",
    "password": "1234",
    "telefono": "912345678"
}
 */

//POST http://localhost:3000/login
//ejemplo de un json para el segundo post de login
/* {
    "email": "diego@gmail.com",
    "password": "1234"
}
 */

//POST http://localhost:3000/servicios
//ejemplo de un json para el segundo post de servicios
/* {
    "id_usuario": 2,
    "nombre_servicio": "Corte de pelo",
    "img_url":"3434",
    "categoria": "peluqueria",
    "descripcion": "Corte de pelo para hombre",
    "monto": "500",
    "ubicacion": "San Miguel"
} */

//GET http://localhost:3000/usuarios?email=diego@gmail.com
//ejemplo de un json para el primer get de usuarios

// POST http://localhost:3000/favoritos
/* {
    "id_servicio":10,
    "id_usuario":2
} */

// GET http://localhost:3000/servicios/10
//ejemplo de un json para el primer get de servicios por id