'use strict'

var mongoose =require('mongoose'),
    conf = require('./conn.json'),
    Schema = mongoose.Schema,
    tareaSchema = new Schema({
        usuario:String,
        fechaInit: Number,
        tarea:String,
        comentarios:[
            {
                emisorCom:String, 
                tareaCom:String,
                fechaCom:Number,
                cantidadT:Number,
                cantidadF:Number,
                likesCom:[
                    {
                        emiLike:String, 
                        likeTru:String
                    }
                ],
				tipo:String,
				mime:String,
				enviado:String
            }
        ],
        implicados:[
            String
        ],
        likes:[
            {
                emiLike:String, 
                likeTru: Boolean
            }
        ],
        proyecto:String,
        estado:String
    },
    {
      collection:"tareas"  
    }),
    tareasModel = mongoose.model('tareas', tareaSchema );
mongoose.connect(`mongodb://${conf.mongo.host}/${conf.mongo.db}`,{ useNewUrlParser: true })

module.exports = tareasModel