var jwt = require('jsonwebtoken'); //importar librería jason web token

var SEED = require('../config/config').SEED; //Semilla para crear token

// =======================================================
// Verificar token 
// =======================================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: "Token incorrecto!",
                errors: err
            })
        }

        // La siquiente línea permite que la información del usuario al cual se le dió el token
        // es decir, el usuario que está haciendo la petición que utiliza este middleware
        // simplemente se accede desde la referencia req
        req.usuario = decoded.usuario;
        next();


    })

}