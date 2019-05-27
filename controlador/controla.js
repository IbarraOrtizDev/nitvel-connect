'use strict'
var modelo = require('../model/modelo.js'),
    formidable = require('formidable'),
    fse = require('fs-extra'),
    fs = require('fs'),
	io = require('../server.js'),
    controla = function(){}
function des(param){
  var a = param,
    b = a.split('');
    for(var c = 0; c<50; c++){
      b.pop()
    }
    var d = b.slice(0,2).join('')
    var nuevo = b.slice(18,b.length),
        array =[]
    for(var f = 0; f< nuevo.length; f++){
      if(f%2 == 0){
        array.push(nuevo[f])
      }else{
      }
    }
    return array.reverse().join('')
}
function enc(cor){
  var correo = cor,
    alfabeto= ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","u","v","w","x","y","z","1","2","3","4","5","6","7","8","9","F","@","-","_","@","$","a",".","Z","."],
    correoArray = correo.split(''),
    correoCont = correoArray.reverse(),
    nuevo=[];


    for(var a = 0; a < correoArray.length; a++){
      var posible = Math.round(Math.random()*67),
          uno=alfabeto[posible],
          dos=correoArray[a],
          tres = uno+dos;
          nuevo.push(tres)
    }
    for(var a = 0; a<50;a++){
      var posible = Math.round(Math.random()*68);
      nuevo.push(alfabeto[posible])
    }
    for(var a = 0; a<15;a++){
      var posible = Math.round(Math.random()*68);
      nuevo.unshift(alfabeto[posible])
    }
    if(correoArray.length<10){
      nuevo.unshift(0+''+correoArray.length)
    }else{
      nuevo.unshift(correoArray.length)
    }
     return nuevo.join('')
}
function encodo(dat){
	let c = JSON.stringify(dat),
		tam = c.length+1,
		str = new Buffer(tam);
		str.write(c,0,tam, 'ascii')
	let g = str.toString('base64')
	let h = g.split('')
	h.pop()
	return h.join('')
}
function descodo(params){
	var l = params.length,
		g = new Buffer(l)
	g.write(params+'=', 0, l, 'base64')
	return JSON.parse(g.toString('ascii').split('}')[0]+'}')
}
function cor(correos, usuario){
    var a = correos,
    b = a.split('/'),
    c = b.indexOf(usuario)
    if(!c){
      return b[1]
    }else{
      return b[0]
    }
}

controla.verificaCorreo = (req,res)=>{
    let dato = req.params.email
    modelo.verificaCorreo(dato, function(result){
        res.json({existe:result})
    })
}
controla.insertarUsuario = (req,res)=>{
    let data = {
        nombre:req.body.nombre,
        apellido:req.body.apellido,
        sexo:req.body.sexo,
        correo:req.body.correo,
        contrasena:req.body.clave,
        profesion:req.body.profesion,
        numeroTelefono:req.body.numeroTelefono,
        pais:req.body.pais,
        ingreso:req.body.horario,
        imagenLink:req.body.imagenLink
    }
    modelo.insertarUsuario(data, function(response){
        res.json(encodo({correo: enc(response.correo), contrasena: enc(response.contrasena)}))
    })
}
controla.insertarImagenUsu =(req,res,next)=>{
	var correo = req.vha.correo,
		k = req.body;
	let envio = {
			imagenLink:'/usuario/'+correo+'.jpeg',
			sexo:k.sexo,
			profesion:k.profesion,
			numeroTelefono:k.numeroTelefono,
			pais:k.pais
	}
	fse.move(req.file.path, 'public/usuario/'+correo+'.jpeg', (err)=>{
		if(err){
			console.log(err)
		}else{
			modelo.insertarImagenUsu(envio, correo, function(){
				res.send('Bien')
			})
		}
	})
}
controla.iniciarsession = (req,res,next)=>{
    let dato = {
        correo:req.body.usuario,
        contrasena:req.body.clave
    }
    modelo.iniciarsession(dato, (response)=>{
        if(response == 1){
            res.send(encodo({correo:enc(dato.correo), contrasena:enc(dato.contrasena)}))
        }else if(response == 0){
            res.send('fallo')
        }
    })
}
controla.traerInfoUser = (req,res,next)=>{
    var horaHoy = req.params.horaHoy
    modelo.traerInfoUser(req.vha.correo, (response)=>{
        res.send(response)
        modelo.crearSumarEntrada(req.vha.correo, horaHoy, 'inicial', 5, ()=>{
			
		})
    })
}
controla.addCalendar = (req, res)=>{
    modelo.addCalendar(req.body, (response)=>{ res.send(response)})
}
controla.infohoraCalendar = (req,res)=>{
    modelo.infohoraCalendar(parseInt(req.params.dato), req.vha.correo, (response)=>{res.json(response)})
}
controla.cambiarEstadoCalendar = (req,res)=>{
    modelo.cambiarEstadoCalendar(req.body, (response)=> res.send('Cambio de estado'))
}
controla.getCalendarUser = (req,res)=>{
    modelo.getCalendarUser(req.vha.correo, (response)=>{
        res.json(response)
    })
}
controla.deleteCalendar = (req,res)=>{
    modelo.deleteCalendar(req.body.id,req.vha.correo, ()=>{
        res.send('eliminado')
    })
}
controla.editCalendar = (req,res)=>{
    modelo.editCalendar(req.params.id, req.body, ()=>{
        res.send('editado')
    })
}
controla.traerNotasRap = (req,res)=>{
    modelo.traerNotasRap(req.vha.correo, (response)=>{
        res.json(response)
    })
}
controla.agregarNota = (req,res)=>{
    modelo.agregarNota(req.body.usuario, req.body.nota, req.body.color, ()=>{
        modelo.traerNotasRap(req.body.usuario, (response)=>{
            res.json(response)
        })
    })
}
controla.eliminarNota = (req, res)=>{
    modelo.eliminarNota(req.body.idG, req.body.idE, ()=>{
        modelo.traerNotasRap(req.body.usuario, (response)=>{
            res.json(response)
        })
    })
}
controla.editarNota = (req,res)=>{
    let a = req.body
    modelo.editarNota(a.idG, a.idE, a.texto, a.color, ()=>{
        modelo.traerNotasRap(req.body.usuario, (response)=>{
            res.json(response)
        })
    })
}
controla.agregarTarea = (req, res)=>{
    modelo.agregarTarea(req.body, ()=>{
        res.send('agregada')
    })
}
controla.buscarTareas = (req,res)=>{
    modelo.buscarTareas(req.vha.correo, (response)=>{
        res.json(response)
    })
}
controla.buscarTareas1 =(req,res)=>{
	modelo.buscarTareas1(req.params.id,req.vha.correo, (response)=>{
		let a = response.comentarios,
			b = a.length
		if(b > 30){
			let x = a.slice(b-21, b-1)
			response.comentarios = x;
			res.json(response)
		}else{
			res.json(response)
		}
    })
}
controla.buscarTareas2 =(req,res)=>{
	modelo.buscarTareas1(req.params.id1, (response)=>{
		let a = response.comentarios
		a.forEach((item, index)=>{
			if(item._id == req.params.id2){
				let r = index-1
				if(r-20 < 0){
					if(index === 0){
					   let g = response.comentarios.slice(0, 1)
					   return res.json([])
					}else if(index > 1){
					   let g = response.comentarios.slice(0, index)
						return res.json(g)
					}
				}else{
					let g = response.comentarios.slice(r-20,index)
					res.send(g)
				}
			}
		})
    })
}
controla.eliminarTarea = (req,res)=>{
	console.log(req.body)
    modelo.eliminarTarea(req.body._id, ()=>{
      res.send('completado')
    })
}
controla.agregarComentario = (req,res)=>{
	req.body.envio.enviado="si"
    modelo.agregarComentario(req.body.envio, req.body.id, ()=>{
        res.send('Agregado')
    })
}


controla.cambiarEstado = (req,res)=>{
    modelo.cambiarEstado(req.body.id, req.body.estado, ()=>res.send('cambiado'))
}
controla.traerRecordatorios = (req,res)=>{
    modelo.traerRecordatorios(req.vha.correo, (response)=>{
		if(response){
			res.json(response)
		}else{
			modelo.crearRecordatorios(req.vha.correo, ()=>{
				modelo.traerRecordatorios(req.vha.correo, (response)=>{res.json(response)})
			})
		}
	})
}
controla.agregarRecord = (req,res)=>{
    let id = req.params.id
    modelo.agregarRecord(req.body.id, req.body.envio, ()=>{
        res.send('creado')
    })
}
controla.editarRecord = (req,res)=>{
    let idG = req.params.idG,
        id = req.params.id
    modelo.editarRecord(idG, id, req.body, ()=>{
        res.send('bien')
    })
}

controla.eliminarRecordatorio = (req,res)=>{
    modelo.eliminarRecordatorio(req.params.idG, req.params.id, ()=>{
        res.send('bien')
    })
}
controla.getBuscarUser = (req, res, next)=>{
    let dato = req.params.user;
    modelo.getBuscarUser(dato, function(response){
        res.send(response)
    })
}
controla.traerUserBuscado = (req,res,next)=>{
    modelo.traerUserBuscado(req.params.correo, (response)=>{
        res.json(response)
    })
}

controla.traercompanero2 =(req,res,next)=>{
        modelo.traercompanero(req.params.correo, (response)=> {
            res.json(response)
        })
}
controla.getUso = (req,res, next)=>{
    modelo.getUso(req.params.correo, req.params.dia, (response)=>{
        res.json(response)
    })
}
controla.enviarSolicitudColaboracion = (req,res)=>{
    modelo.enviarSolicitudColaboracion(req.body, ()=>{
        res.send('solicitud enviada')
    })
}
controla.cancelarSolicitudColaboracion = (req,res)=>{
    modelo.cancelarSolicitudColaboracion(req.body, ()=>{
        res.send('solicitud cancelada')
    })
}
controla.aceptarSolicitudColaboracion = (req,res)=>{
    modelo.aceptarSolicitudColaboracion(req.body, ()=>{
        res.send('aceptado')
    })
}
controla.getProyecto = (req,res)=>{
	
    var s = {
        tareas:null,
        calendario:null,
		proyecto:null
    }
    modelo.getProyectoTareas(req.params.proyecto, req.vha.correo, (result)=>{
        s.tareas = result
        modelo.getProyectoCalendar(req.params.proyecto, req.vha.correo, (resulte)=>{
            s.calendario = resulte
            modelo.getProyecto(req.params.proyecto, req.vha.correo, (response)=>{
				s.proyecto = response
				res.json(s)
			})
        })
    })
}
controla.addUserProjectSimple = (req,res)=>{
    let a =req.body
   modelo.crearProyectoColaborador(a.usuarioAdd, a.nameProject, a.newUser, ()=>{
		res.send()
   })
}
controla.addUserProjectTodo = (req,res)=>{
	let a =req.body;
	modelo.crearProyectoColaborador(a.usuarioAdd, a.nameProject, a.newUser, ()=>{
		modelo.addUserCalendarios(a.usuarioAdd, a.nameProject, {correo:a.newUser, estado:'pendiente'}, ()=>{
			modelo.addUserTareas(a.usuarioAdd, a.nameProject, a.newUser, ()=>{
				res.send()
			})
		})
	})
}
controla.projectCompletado = (req,res)=>{
    let usuario = req.body.usuario,
        idS = req.body.idS,
        proyecto = req.body.proyecto,
        estado = req.body.estado,
        fecha = req.body.fecha,
        tipo = req.body.tipo,
        puntos = req.body.puntos
	modelo.projectCompletadoUser(usuario,proyecto,estado, ()=>{
		modelo.crearSumarEntrada(usuario, fecha, tipo, puntos, ()=>{
			modelo.projectCompletadoTareas(usuario, proyecto, estado, ()=>{
				modelo.projectCompletadoCalendarios(usuario, proyecto, estado, ()=>{
    				res.send(estado)	
				})
			})
		})
	})
}
controla.eliminarProject = (req,res)=>{
    let usuario = req.body.usuario,
        idS = req.body.idS,
        proyecto = req.body.proyecto
    modelo.projectEliminar(usuario, proyecto, ()=>{
		modelo.eliminarTarea2(usuario, proyecto, ()=>{
			modelo.deleteCalendar2(usuario, proyecto, ()=> {
				res.send('eliminado')
			})
		})
	})
}
controla.eliminarParticipacion = (req, res)=>{
    let usuario = req.params.correo,
        proyecto = req.params.proyecto
    modelo.eliminarParticipacionProject(usuario, proyecto, ()=>{
		res.send()
	})
}


controla.buscarProject = (req,res)=>{
    modelo.buscarProject(req.vha.correo, (response)=>res.json(response))
}
controla.buscarProject3 = (req,res)=>{
    modelo.buscarProject3(req.vha.correo, (response)=>res.json(response))
}

controla.addProject = (req,res)=>{
	modelo.addProject(req.body, (response)=> res.send(response))
}
//Chat
controla.getProjectSimple = (req,res)=>{
	modelo.getProjectSimple(req.vha.correo, (response)=>{
		response.forEach((item)=>{
			if(item.msg.length >= 1){
				item.msg = item.msg[item.msg.length-1]
				item.ultimo =parseInt(item.msg[item.msg.length-1].fecha)
			}
		})
		res.json(response)
	})
}
controla.buscarMensajes = (req,res)=>{
	modelo.buscarMensajes(req.params.id, (response)=>{
		//res.json(response)
		let a = response.msg,
			b = a.length
		if(b > 30){
			let x = a.slice(b-20, b)
			response.msg = x;
			res.json(response)
		}else{
			res.json(response)
		}
	})
}
controla.buscarMensajes2 = (req,res)=>{
    
	modelo.buscarMensajes(req.params.id1, (response)=>{
		let a = response.msg,
            c = response.msg,
            t = a.length,
            y = req.params.id2,
            z = []
        a.forEach(item=>z.push(item))
        
        var ss =z.findIndex((item,index)=>{
            return item._id==y
        })
        if(ss-20 < 0 ){
            res.json(a.slice(0,ss))
        }else{
            res.json(a.slice(ss-20,ss))
        }
    })
}
controla.buscarN = (req,res)=>{
	let usuario = req.vha.correo,
		fecha = parseInt(req.params.fecha),
		datos = {
			calendario:null,
			recordatorios:null,
			solicitudes:null,
			mensajes:null,
			tareas:null
		}
	modelo.buscarNcalendario(usuario, fecha, (response)=>{
		datos.calendario = response
		modelo.buscarNrecordatorio(usuario, fecha, (result)=>{
			datos.recordatorios = result[0] ? result[0].recordatorios : []
			modelo.buscarNtarea(usuario, (respuesta)=>{
				datos.tareas = response
				modelo.buscarNequipo(usuario, (r)=>{
					datos.solicitudes = r
					modelo.buscarNmensajes(usuario, (resultado)=>{
						datos.mensajes = resultado
						res.json(datos)
					})
				})
			})
		})
	})
}

controla.cambioImagen = (req,res)=>{
    var ima = req.file,
        ubicacionAct = req.file.path,
        newUbicacion = 'public/usuario/'+req.params.correo+'.jpeg'
    fse.remove(newUbicacion, (err)=>{
        if(err){
            console.log(err)
        }else{
            fse.move(ubicacionAct, newUbicacion, (er)=>{
                if(er){
                    console.log('fallo')
                }else{
                    res.send('cambio')
                }
            })
        }
    })
}
controla.agregarInfoMejora = (req,res)=>{
    modelo.agregarInfoMejora(req.body, ()=>{
        res.send()
    })
}
module.exports = controla