'use strict'
var mongoose =  require('mongoose')
var servidorDB = require('./conn.json'),
    Schema = mongoose.Schema,
    connEquipo = new Schema({
        conexion:String,
        uno:String,
        dos:String,
        inicial:Number,
        estado:String
    },
    {
        collection:"equipo"
    }),
    equipoRegister = mongoose.model('equipo', connEquipo);

mongoose.connect(`mongodb://${servidorDB.mongo.host}/${servidorDB.mongo.db}`,{ useNewUrlParser: true })

module.exports = equipoRegister