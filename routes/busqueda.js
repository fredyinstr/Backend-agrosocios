// import { Promise } from 'mongoose';
// import { reject } from 'q';

var express = require('express');

var app = express();

var Proyecto = require('../models/proyecto');
var Usuario = require('../models/usuario');

// ============================================
// Búsqueda por colección específica
// ============================================
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var expReg = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, expReg);
            break;
        case 'proyectos':
            promesa = buscarProyectos(busqueda, expReg);
            break;
        default:
            return res.status(400).json({
                ok: false,
                error: { message: 'tipo de colección no válido' }
            })
    }

    promesa.then(data => {
        res.status(400).json({
            ok: true,
            [tabla]: data
        })
    })
})

// ============================================
// Búsqueda general
// ============================================
app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var expReg = new RegExp(busqueda, 'i');

    // En el arreglo de funciones se pueden pasar todas las funciones que devuelvan promesas
    // Las respuestas llegan en el mismo orden en el que se enviaron las solicitudes
    Promise.all([buscarProyectos(busqueda, expReg),
            buscarUsuarios(busqueda, expReg)
        ])
        .then(respuestas => {
            res.status(200).json({
                ok: true,
                proyectos: respuestas[0],
                usuarios: respuestas[1]
            })
        })
});

function buscarUsuarios(busqueda, expReg) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': expReg }, { 'email': expReg }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('Error al buscar usuarios', err);
                } else {
                    resolve(usuarios);
                }
            })
    })
}

function buscarProyectos(busqueda, expReg) {

    return new Promise((resolve, reject) => {
        Proyecto.find({ nombre: expReg })
            .populate('usuario', 'nombre email')
            .exec((err, proyectos) => {
                if (err) {
                    reject('Error al buscar proyectos', err);
                } else {
                    resolve(proyectos);
                }
            })
    })
}


module.exports = app;