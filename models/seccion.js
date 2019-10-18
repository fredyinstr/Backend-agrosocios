var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var seccionSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] }
}, { collection: 'secciones' });


module.exports = mongoose.model('Seccion', seccionSchema);