'use strict'
var app = require('./app.js'),
    server = app.listen(app.get('port'), ()=>{console.log(`Servidor corriendo en el puerto:${app.get('port')}`)}),
    io = require('socket.io')(server),
	fs = require('fs'),
    modelo = require('./model/modelo.js'),
	formidable = require('formidable'),
	fs = require('fs'),
	fse = require('fs-extra'),
	multer = require('multer'),
	upload = multer({dest:'uploads'})

io.on('connection', (socket)=>{
	socket.on('mensajeVistoDirecto', (dat)=>{
		modelo.vistoChat2(dat.id, dat.fecha, dat.correo, (response)=>{
			
			socket.emit(dat.id+'visto', dat.correo)
		})
	})
    console.log('Usuario conectado')
    socket.on('comentariosTareas', (dato)=>{
		let a = 'comentario'+dato.id,
			b = {
				fecha:dato.envio.fechaCom,
				id:dato.id,
				usuario:dato.envio.emisorCom
			}
		//usuario que envia
		socket.emit('comentario', dato.envio)
		//usuario que resive
		socket.broadcast.emit('comentario'+dato.id, dato.envio)
		
		/*console.log('res')
		if(dato.envio.tipo !== 'text'){
			fs.writeFile("public"+dato.envio.tareaCom, dato.base, 'base64', (err, data) => {
				if(err){
					console.log(err)
				}else{
					modelo.agregarComentario(dato.envio, dato.id, ()=>{
						
					})
				}
			})
		}else{
			modelo.agregarComentario(dato.envio, dato.id, ()=>{
				socket.emit('comentario'+dato.id, dato.envio)
				socket.broadcast.emit('comentario'+dato.id, dato.envio)
			})
		}*/
})
})

app.post('/agregarMsgText', function(req,res){
	let envio = req.body.guardar,
		id=req.body.id;
		//console.log(envio)
		//io.emit(req.body.id, envio)
	modelo.guardarMensaje(id, envio, (dat)=>{
		res.send()
		io.emit(req.body.id, envio)
		/*dat.implicados.forEach((item)=>{
			io.emit('mensaje'+item, {envio:envio, id:id})
		})*/
	})
})
app.post('/agregarMensajeAdjunto', upload.single('blob'), (req,res)=>{
	var h= req.body,
		datos = {
			envia:h.envia, 
			enviado:h.enviado, 
			fecha:h.fecha, 
			link:h.link, 
			nombre:h.nombre, 
			tipo:h.tipo,
			recibido:[h.envia]
		}
	fse.move(req.file.path, h.direccion, (err)=>{
		if(err){
			console.log(err)
		}else{
		modelo.guardarMensaje(h.id, datos, (dat)=>{
				res.send('nn')
				io.emit('voice'+h.id, datos)
				io.emit(req.body.id,datos)
				/*dat.implicados.forEach((item)=>{
					io.emit('mensaje'+item, {envio:datos, id:h.id})
				})*/
			})
		}
	})
})
app.post('/agregarVideoAdjunto', upload.fields([{name:'video'},{name:'imagen'}]), (req,res)=>{
	let video = req.files.video[0],
		imagen = req.files.imagen[0]
	var h= req.body,
		datos = {
			envia:h.envia, 
			enviado:h.enviado, 
			fecha:h.fecha, 
			link:h.link, 
			nombre:h.nombre, 
			tipo:h.tipo,
			linkImagenVideo:'/imagenV/'+h.envia+Date.parse(new Date())+'.jpeg',
			recibido:[h.envia]
		}
	fse.move(video.path, h.direccion, (err)=>{
		if(err){
			console.log(err)
		}else{
			fse.move(imagen.path, './public'+datos.linkImagenVideo, (err)=>{
				modelo.guardarMensaje(h.id, datos, (dat)=>{
					res.send('nn')
					io.emit('voice'+h.id, datos)
					io.emit(req.body.id, datos)
					/*dat.implicados.forEach((item)=>{
						io.emit('mensaje'+item, {envio:datos, id:h.id})
					})*/
				})
			})
		}
	})
} )
app.post('/visto/:id/:correo',(req,res)=>{
	var g = req.body;
	g.ids.forEach((item)=>{
		modelo.vistoChat(req.params.id, item, req.params.correo, function(){
		})
	})
	io.emit(req.params.id+'visto', req.params.correo)
	res.send('ss')
})