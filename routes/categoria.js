var express = require('express');
//var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

//var SEED = require('../config/config').SEED;

var app = express();


var Categoria = require('../models/categoria');
var Seccion = require('../models/seccion');

// =======================================================
// Obtener todas las categorías
// =======================================================
app.get('/', (req, res, next) => {

    // var desde = req.query.desde || 0;
    // desde = Number(desde);

    Categoria.find({}, 'nombre descripcion')
        .exec(
            (err, categorias) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando categorias',
                        errors: err
                    });
                }

                Categoria.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        categorias: categorias,
                        total: conteo
                    });
                });
            });
});

// Obtener categorias agrupadas por sección
app.get('/porseccion', (req, res, next) => {
    Categoria.aggregate([{
        $group: {
            _id: "$seccion",
            count: { $sum: 1 },
            entry: {
                $push: {
                    nombre: "$nombre"
                }
            }
        }
    }], function(err, result) {
        if (err) {
            next(err);
        } else {
            res.status(200).json({
                ok: true,
                categorias: result
            });
        }
    });
});

// =======================================================
// Actualizar una categoria 
// =======================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar categoría!',
                errors: err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La categoría con el id ' + id + ' no existe',
                errors: { message: 'No existe una categoría con este ID' }
            });
        }

        categoria.nombre = body.nombre;
        categoria.descripcion = body.descripcion;

        categoria.save((err, categoriaGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar categoría',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                categoria: categoriaGuardada
            });
        });
    });
});


// =======================================================
// Crear nueva categoria
// =======================================================

app.post('/', (req, res) => {
    var body = req.body;


    // Usamos el model Categoria y la creamos
    var categoria = new Categoria({
        nombre: body.nombre,
        seccion: body.seccion
    });

    categoria.save((err, categoriaCreada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear categoria, verifique que no esté creada ya',
                errors: err
            });
        }


        //seccion.categorias.push(categoriaCreada._id);
        // El objeto usuarioToken que es el usuario autenticado me la proporciona el middleware mdAutenticacion.verificaToken
        res.status(201).json({
            ok: true,
            categoria: categoriaCreada,
            usuarioToken: req.usuario
        });

    });

});


// =======================================================
// Borrar una categoría 
// =======================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar categoría',
                errors: err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una categoría con ese id',
                errors: { message: 'No existe una categoría con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            articulo: categoriaBorrada
        });

    })
})

module.exports = app;