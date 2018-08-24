var express = require('express');
//var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

//var SEED = require('../config/config').SEED;

var app = express();


var Proyecto = require('../models/proyecto');

// =======================================================
// Obtener todos los proyectos
// =======================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Proyecto.find({}, 'nombre descripcion usuario fecha tipo tiempo monto')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'role nombre email') // populate me permite adicionar info de otra tabla teniendo id
        .populate('imagenes')
        .exec(
            (err, proyectos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Proyectos',
                        errors: err
                    });
                }

                Proyecto.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        proyectos: proyectos,
                        total: conteo
                    });
                });
            });
});

// =======================================================
// Obtener proyectos por usuario
// =======================================================
app.get('/:id', (req, res, next) => {

    var id = req.params.id;
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Proyecto.find({ usuario: id }, 'nombre descripcion usuario fecha tipo tiempo monto imgs')
        .skip(desde)
        .limit(5)
        .populate('usuario', 'role nombre email img') // populate me permite adicionar info de otra tabla teniendo id
        .populate('imagenes')
        .exec(
            (err, proyectos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Proyectos',
                        errors: err
                    });
                }

                Proyecto.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        proyectos: proyectos,
                        total: conteo
                    });
                });
            });
});

// =======================================================
// Actualizar un proyecto 
// =======================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Proyecto.findById(id, (err, proyecto) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar proyecto!',
                errors: err
            });
        }

        if (!proyecto) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El proyecto con el id ' + id + ' no existe',
                errors: { message: 'No existe usuario con este ID' }
            });
        }

        proyecto.nombre = body.nombre;
        proyecto.descripcion = body.descripcion;
        proyecto.usuario = req.usuario;
        proyecto.fecha = body.fecha;
        proyecto.tipo = body.tipo;
        proyecto.tiempo = body.tiempo;
        proyecto.monto = body.monto;

        proyecto.save((err, proyectoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar proyecto',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                proyecto: proyectoGuardado
            });
        });
    });
});


// =======================================================
// Crear nuevo proyecto
// =======================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    // Usamos el model Proyecto
    var proyecto = new Proyecto({
        nombre: body.nombre,
        descripcion: body.descripcion,
        usuario: req.usuario,
        fecha: body.fecha,
        tipo: body.tipo,
        tiempo: body.tiempo,
        monto: body.monto
    });

    proyecto.save((err, proyectoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear proyecto',
                errors: err
            });
        }
        // El objeto usuarioToken que es el usuario autenticado me la proporciona el middleware mdAutenticacion.verificaToken
        res.status(201).json({
            ok: true,
            proyecto: proyectoGuardado,
            usuarioToken: req.usuario
        });

    });


});


// =======================================================
// Borrar un proyecto 
// =======================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Proyecto.findByIdAndRemove(id, (err, proyectoBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar proyecto',
                errors: err
            });
        }

        if (!proyectoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un proyecto con ese id',
                errors: { message: 'No existe un proyecto con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: proyectoBorrado
        });

    })
})

module.exports = app;