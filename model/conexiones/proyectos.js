'use strict'

var mongoose = require('mongoose'),
	servidorDB = require('./conn.json'),
	Schema = mongoose.Schema,
	connProject = new Schema({
		nombre:String,
		descripcion:String,
		creador:String,
		fecha:Number,
		estado:String,
		ultimo:Number,
		implicados:[
			String
		],
		msg:[
			{
				envia:String,
				fecha:Number,
				tipo:String,
				nombre:String,
				link:String,
				linkImagenVideo:String,
				msg:String,
				enviado:String,
				recibido:[
					String
				]
			}
		]
	},
	{
		collection:'proyecto'	
	}),
	projectRegister = mongoose.model('proyecto', connProject)

mongoose.connect(`mongodb://${servidorDB.mongo.host}/${servidorDB.mongo.db}`,{ useNewUrlParser: true })

module.exports = projectRegister