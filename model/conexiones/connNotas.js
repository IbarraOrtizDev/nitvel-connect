'use strict'
var mongoose =  require('mongoose')
var servidorDB = require('./conn.json'),
    Schema = mongoose.Schema,
    connNotas = new Schema({
        usuario:String,
        notas:[
            {
             color:String,
             texto:String,
             id:String
            }
        ]
    },
    {
        collection:"stick"
    }),
    userNotas = mongoose.model('stick', connNotas);

mongoose.connect(`mongodb://${servidorDB.mongo.host}/${servidorDB.mongo.db}`,{ useNewUrlParser: true })

module.exports = userNotas