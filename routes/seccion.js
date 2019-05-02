var express = require('express');
//var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

//var SEED = require('../config/config').SEED;

var app = express();


var Seccion = require('../models/seccion');
var Categoria = require('../models/categoria');

// =======================================================
// Obtener todas las secciones
// =======================================================
app.get('/', (req, res, next) => {

    // var desde = req.query.desde || 0;
    // desde = Number(desde);

    Seccion.find({}, 'nombre descripcion')
        .exec(
            (err, secciones) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando secciones',
                        errors: err
                    });
                }

                Seccion.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        secciones: secciones,
                        total: conteo
                    });
                });
            });
});

// =======================================================
// Actualizar una seccion 
// =======================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Seccion.findById(id, (err, seccion) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar seccion!',
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

        seccion.nombre = body.nombre;
        seccion.descripcion = body.descripcion;

        seccion.save((err, seccionGuardada) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar seccion',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                seccion: seccionGuardada
            });
        });
    });
});


// =======================================================
// Crear nueva seccion
// =======================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    // Usamos el model Seccion
    var seccion = new Seccion({
        nombre: body.nombre,
        descripcion: body.descripcion
    });

    seccion.save((err, seccionCreada) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear seccion',
                errors: err
            });
        }
        // El objeto usuarioToken que es el usuario autenticado me la proporciona el middleware mdAutenticacion.verificaToken
        res.status(201).json({
            ok: true,
            seccion: seccionCreada,
            usuarioToken: req.usuario
        });

    });


});


// =======================================================
// Borrar una seccion 
// =======================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Seccion.findByIdAndRemove(id, (err, seccionBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar sección',
                errors: err
            });
        }

        if (!seccionBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una sección con ese id',
                errors: { message: 'No existe una sección con ese id' }
            });
        }

        // Debemos eliminar las referencias hechas en la colección Categorías
        Categoria.deleteMany({ seccion: id }, function(err) {
            res.status(500).json({
                ok: false,
                mensaje: "error al borrar referencias"
            });
        });

        res.status(200).json({
            ok: true,
            usuario: seccionBorrada
        });

    });
});

module.exports = app;