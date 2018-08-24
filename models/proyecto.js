var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var tiposValidos = {
    values: ['PISCICOLA_TYPE', 'PORCICOLA_TYPE', 'GANADERO_TYPE', 'AGRICOLA_TYPE'],
    message: '{VALUE} no es un tipo permitido'
};

var proyectoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    descripcion: { type: String, required: [true, 'La descripción es necesaria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' },
    fecha: { type: String, required: [true, 'El proyecto debe tener una fecha'] },
    tipo: { type: String, required: [true, 'Debe proporcionar un tipo de proyecto'], default: "PISCICOLA_TYPE", enum: tiposValidos },
    tiempo: { type: Number, required: [true, 'Debe proporcionar un tiempo de proyecto'] },
    monto: { type: Number, required: [true, 'Debe proporcionar un monto de proyecto'] },
    imagenes: [{ type: Schema.Types.ObjectId, ref: 'ImgsProyecto' }]

}, { collection: 'proyectos' });

proyectoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('Proyecto', proyectoSchema);