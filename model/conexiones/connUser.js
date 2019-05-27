'use strict'
var mongoose =  require('mongoose')
var servidorDB = require('./conn.json'),
    Schema = mongoose.Schema,
    connUser = new Schema({
        nombre:String,
        apellido:String,
        sexo:String,
        correo:String,
        contrasena:String,
        profesion:String,
        numeroTelefono:Number,
        pais:String,
        ingreso:String,
        imagenLink:String,
        recu:Number,
        usuariosTrab:[{conexion:String, estado:String, remitente:String}],
        proyectos:[
            {creador:String, fechaFin:Number, estado:String, nombre:String, fecha:Number, descripcion:String, implicados:[
                String
            ]}
        ]
    },
    {
        collection:"usuarios"
    }),
    userRegister = mongoose.model('usuarios', connUser);

mongoose.connect(`mongodb://${servidorDB.mongo.host}/${servidorDB.mongo.db}`,{ useNewUrlParser: true })

module.exports = userRegister
//{correo:String, nombre:String, apellido:String, estado:String}