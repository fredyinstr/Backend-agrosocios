var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var imgsProyectoSchema = new Schema({
    proyecto: { type: Schema.Types.ObjectId, ref: 'Proyecto' },
    img: { type: String, required: false }
}, { collection: 'imgsProyectos' });

imgsProyectoSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });

module.exports = mongoose.model('ImgsProyecto', imgsProyectoSchema);