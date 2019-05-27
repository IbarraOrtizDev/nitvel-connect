var mongoose = require('mongoose'),
    conf = require('./conn.json'),
    Schema = mongoose.Schema,
    connVista = new Schema({
        tipo:String,
        quien:String,
        comentario:String
    },
    {
        collection:'vista'
    }),
    vistaModel = mongoose.model('vista', connVista)

mongoose.connect(`mongodb://${conf.mongo.host}/${conf.mongo.db}`,{ useNewUrlParser: true })
module.exports = vistaModel