var express = require('express');
var fileUpload = require('express-fileupload');


var app = express();

// Importamos los modelos de las tablas
var Usuario = require('../models/usuario');
var Proyecto = require('../models/proyecto');
var ImgsProyecto = require('../models/imgsProyecto');
var Articulo = require('../models/articulo');

// Esta librería permite acceder a los archivos subidos al servidor
var fs = require('fs');

// Middleware para subir archivos al servidor
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos válidos
    var tiposValidos = ['usuarios', 'imgsProyectos', 'articulos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: { message: 'colecciones válidas: ' + tiposValidos.join(', ') }
        });
    }
    // Si no hay un archivo en la petición...
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó nada',
            errors: { message: 'Debe seleccionar una imagen' }
        });
    }

    // Obtener el nombre del archivo de la referencia imagen

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Extensiones válidas

    var extensionesValidas = ['jpg', 'JPG',
        'png', 'PNG',
        'gif', 'GIF', 'jpeg', 'JPEG'
    ];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        })
    }

    // Nombre de archivo personalizado.> <idusuario>-<random>.extension
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;
    // Mover el archivo a una extensión en particular
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    subirPorTipo(tipo, path, id, archivo, nombreArchivo, res);

});





function subirPorTipo(tipo, path, id, archivo, nombreArchivo, res) {

    if (tipo === 'usuarios') {

        // verificamos si existe la id 
        Usuario.findById(id, (err, usuario) => {

            if (err) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Id de usuario no encontrada',
                    errors: 'Id de usuario no encontrada ' + err
                });
            }
            // Movemos el archivo
            archivo.mv(path, err => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al mover archivo',
                        errors: err
                    })
                }

            });


            // Si ya existe una imagen para este usuario, la eliminamos para cargar la nueva
            // y no cargar el servidor con imágenes obsoletas
            var pathViejo = './uploads/usuarios/' + usuario.img;
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                })
            })
        });
    }

    if (tipo === 'imgsProyectos') {

        Proyecto.findById(id, (err, proyecto) => {

            if (err) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Id de proyecto no encontrado',
                    errors: 'Id de proyecto no encontrado ' + err
                })
            }

            // return res.status(200).json({
            //     ok: true,
            //     proyecto: proyecto
            // })


            // Movemos el archivo
            archivo.mv(path, err => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al mover archivo',
                        errors: err
                    })
                }

            });



            var imgProyecto = new ImgsProyecto({
                proyecto: id,
                img: nombreArchivo
            });

            imgProyecto.save((err, imgCreada) => {

                proyecto.imagenes.push(imgCreada._id);
                proyecto.save((err, imgProyectoGuardado) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'Error al actualizar imagen de proyecto',
                            errors: err
                        });
                    }
                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de proyecto creada',
                        imagen: imgCreada
                    });
                });
            });
        });
    }

    // Subir imágenes de los artículos de la tienda

    if (tipo === 'articulos') {

        // verificamos si existe la id 
        Articulo.findById(id, (err, articulo) => {

            if (err) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Id de articulo no encontrada',
                    errors: 'Id de articulo no encontrada ' + err
                });
            }
            // Movemos el archivo
            archivo.mv(path, err => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al mover archivo',
                        errors: err
                    });
                }
            });


            // Si ya existe una imagen para este articulo, la eliminamos para cargar la nueva
            // y no cargar el servidor con imágenes obsoletas
            // var pathViejo = './uploads/articulos/' + articulo.img;
            // if (fs.existsSync(pathViejo)) {
            //     fs.unlinkSync(pathViejo);
            // }
            articulo.imagenes.push(nombreArchivo);
            articulo.save((err, articuloActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de articulo actualizada',
                    articulo: articuloActualizado
                });
            });
        });
    }

}


module.exports = app;