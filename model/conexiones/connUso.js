'use strict'

var mongoose = require('mongoose'),
    servidorDB = require('./conn.json'),
    Schema = mongoose.Schema,
    connUso = new Schema({
        usuario: String,
        dias:[
            {
                dia:Number,
                puntos:Number
            }
        ]
    },
    {
        collection:'uso'
    }),
    usoRegister = mongoose.model('uso', connUso);
mongoose.connect(`mongodb://${servidorDB.mongo.host}/${servidorDB.mongo.db}`,{ useNewUrlParser: true })

module.exports = usoRegister