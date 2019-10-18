var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var categoriaSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    // descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    seccion: { type: Schema.Types.ObjectId, ref: 'Seccion' }
}, { collection: 'categorias' });

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} ya existe' });

module.exports = mongoose.model('Categoria', categoriaSchema);