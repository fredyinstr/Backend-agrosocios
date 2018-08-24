// Requires

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables

var app = express();

// Middleware que permite extraer la información del body de una petición tipo x-www-form-urlencoded
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar rutas

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var proyectoRoutes = require('./routes/proyecto');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// Conexión a la base de datos

mongoose.connection.openUri('mongodb://www.smartechingenieria.com:27017/agrosociosDB', (err, res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' online');
})


// Rutas  

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