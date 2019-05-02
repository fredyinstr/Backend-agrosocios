var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var articuloSchema = new Schema({
    nombre: { type: String, unique: true, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    precio: { type: Number, required: [true, 'El precio es necesario'] },
    cantidad: { type: Number },
    seccion: { type: Schema.Types.ObjectId, ref: 'Seccion' },
    categoria: { type: Schema.Types.ObjectId, ref: 'Categoria' }
}, { collection: 'articulos' });

articuloSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Articulo', articuloSchema);