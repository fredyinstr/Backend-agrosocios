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

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;


    // Primero verificamos que el usuario envíe el id de sección a la cual pertenecerá la categoría
    idseccion = body.idseccion;

    if (!idseccion) {
        return res.status(400).json({
            ok: false,
            mensaje: 'debe seleccionar una sección'
        });
    }

    // Verificamos que el id de sección exista
    Seccion.findById(idseccion, (err, seccion) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar la sección!',
                errors: err
            });
        }

        if (!seccion) {
            return res.status(400).json({
                ok: false,
                mensaje: 'La sección con el id ' + id + ' no existe',
                errors: { message: 'No existe una sección con este ID' }
            });
        }

        // La sección existe, entonces vamos a crear la categoría y la asociamos a esa sección

        // Usamos el model Categoria y la creamos
        var categoria = new Categoria({
            nombre: body.nombre,
            descripcion: body.descripcion,
            seccion: idseccion
        });

        categoria.save((err, categoriaCreada) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al crear categoria',
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