// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables

var app = express();

// Habilitar peticiones de otros dominios - CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
    next();
});


// Middleware que permite extraer la información del body de una petición tipo x-www-form-urlencoded
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Importar rutas

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var proyectoRoutes = require('./routes/proyecto');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');
var seccionRoutes = require('./routes/seccion');
var categoriaRoutes = require('./routes/categoria');
var articuloRoutes = require('./routes/articulo');

// Conexión a la base de datos

mongoose.connection.openUri('mongodb://www.smartechingenieria.com:28017/agrosocio', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online');
});


// Rutas  

app.use('/articulo', articuloRoutes);
app.use('/seccion', seccionRoutes);
app.use('/categoria', categoriaRoutes);
app.use('/img', imagenesRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/proyecto', proyectoRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);


app.use('/', appRoutes);



//Escuchar peticiones

app.listen('3000', () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' online');
});