'use strict'
var mongoose =  require('mongoose')
var servidorDB = require('./conn.json'),
    Schema = mongoose.Schema,
    connCalendar = new Schema({
        horaInit:Number,
        horaFin:Number,
        usuario:String,
        proyecto:String,
        contenido:String,
        estado:String,
        usuarios:[
            {correo:String, estado:String}
        ]  
    },
    {
        collection:"calendario"
    }),
    calendarRegister = mongoose.model('calendario', connCalendar);

mongoose.connect(`mongodb://${servidorDB.mongo.host}/${servidorDB.mongo.db}`,{ useNewUrlParser: true })

module.exports = calendarRegister