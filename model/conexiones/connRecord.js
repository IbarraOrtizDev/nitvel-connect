'use strict'

var mongoose = require('mongoose'),
    servidorDB = require('./conn.json'),
    Schema = mongoose.Schema,
    connRecord = new Schema({
        usuario:String,
        recordatorios:[
            {
                notificacion:String,
				tipo:String,
				lapso:Number,
				inicio:Number,
				limite:Number,
				cada:Number,
				hora:String
            }
        ]
    },
    {
      collection:'record'    
    }),
    userRecord = mongoose.model('record', connRecord)

mongoose.connect(`mongodb://${servidorDB.mongo.host}/${servidorDB.mongo.db}`,{ useNewUrlParser: true })

module.exports = userRecord

