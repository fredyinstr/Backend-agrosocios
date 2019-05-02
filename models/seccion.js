var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var seccionSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] }
}, { collection: 'secciones' });


module.exports = mongoose.model('Seccion', seccionSchema);