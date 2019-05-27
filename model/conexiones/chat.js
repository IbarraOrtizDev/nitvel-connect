'use strict'

var mongoose = require('mongoose'),
	servidorDB = require('./conn.json'),
	Schema = mongoose.Schema,
	connChat = new Schema({
		codigo:String,
		envia:String,
		fecha:Number,
		tipo:String,
		nombre:String,
		link:String,
		linkImagenVideo:String,
		msg:String,
		implicados:[
			{
				correo:String,
				estado:String
			}
		]
	})