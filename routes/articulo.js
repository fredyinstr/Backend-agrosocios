var express = require('express');
//var bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

//var SEED = require('../config/config').SEED;

var app = express();


var Categoria = require('../models/categoria');
var Seccion = require('../models/seccion');
var Articulo = require('../models/articulo');

// =======================================================
// Obtener todos los artículos
// =======================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Articulo.find({})
        .skip(desde)
        .limit(5)
        .exec(
            (err, articulos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando los artículos',
                        errors: err
                    });
                }

                Articulo.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        articulos: articulos,
                        total: conteo
                    });
                });
            });
});

// =======================================================
// Actualizar un artículo 
// =======================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Articulo.findById(id, (err, articulo) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar el artículo!',
                errors: err
            });
        }

        if (!articulo) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El artículo con el id ' + id + ' no existe',
                errors: { message: 'No existe una artículo con este ID' }
            });
        }

        articulo.nombre = body.nombre;
        articulo.descripcion = body.descripcion;
        articulo.precio = body.precio;
        articulo.cantidad = body.cantidad;
        articulo.seccion = body.seccion;
        articulo.categoria = body.categoria;

        articulo.save((err, articuloActualizado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar articulo',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                articulo: articuloActualizado
            });
        });
    });
});


// =======================================================
// Crear nuevo artículo
// =======================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;

    idseccion = body.idseccion;
    idcategoria = body.idcategoria;

    if (!idseccion) {
        return res.status(400).json({
            ok: false,
            mensaje: 'debe seleccionar una sección'
        });
    }

    if (!idcategoria) {
        return res.status(400).json({
            ok: false,
            mensaje: 'debe seleccionar una categoría'
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

        // Verificamos que el id de categoría exista
        Categoria.findById(idcategoria, (err, categoria) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar la categoría!',
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

            // La sección y la categoría existen, entonces vamos a crear el artículo

            // Usamos el model Artículo
            var articulo = new Articulo({
                nombre: body.nombre,
                descripcion: body.descripcion,
                precio: body.precio,
                cantidad: body.cantidad,
                seccion: idseccion,
                categoria: idcategoria
            });

            articulo.save((err, articuloCreado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al crear el artículo',
                        errors: err
                    });
                }


                //seccion.categorias.push(categoriaCreada._id);
                // El objeto usuarioToken que es el usuario autenticado me la proporciona el middleware mdAutenticacion.verificaToken
                res.status(201).json({
                    ok: true,
                    articulo: articuloCreado,
                    usuarioToken: req.usuario
                });

            });

        });

    });

});
// =======================================================
// Borrar un artículo
// =======================================================

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;

    Articulo.findByIdAndRemove(id, (err, articuloBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el artículo',
                errors: err
            });
        }

        if (!articuloBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un artículo con ese id',
                errors: { message: 'No existe una artículo con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            articulo: articuloBorrado
        });

    })
})

module.exports = app;