const jwt = require('jsonwebtoken');

//middleware para validar token
const verificarToken = (req, res, next) => {
    try {
        let Authorization = req.header("Authorization")   || req.body.headers.Authorization;
        //si no encuentra nada en req.headrer("Authorization") que busque en req.body.headers.Authorization
        if (!Authorization) {
            Authorization = req.body.headers.Authorization;
        }
        if (!Authorization) {
            console.log("Sin token");
            return res.status(401).json('Sin token');
        }
        const token = Authorization.split("Bearer ")[1];
        if (!token) {
            console.log("Sin token");
            return res.status(401).json('Sin token');
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json('Token inválido');
            }
            console.log("Token válido");
            req.email = decoded.email; // Asegúrate de que el token incluya la propiedad 'email'
            next();
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
};

module.exports = {
    verificarToken
};
