'use strict'
var mongoose = require('mongoose'),
    connUser = require('./conexiones/connUser.js'),
    connCalendar = require('./conexiones/connCalendar.js'),
    connNotas = require('./conexiones/connNotas.js'),
    connTareas = require('./conexiones/connTareas.js'),
    connRecord = require('./conexiones/connRecord.js'),
    connEquipo = require('./conexiones/equipo'),
    connUso = require('./conexiones/connUso.js'),
	connProject = require('./conexiones/proyectos.js'),
    connVista = require('./conexiones/prueba.js'),
    conectar = function(){};

conectar.getUser = (cb)=>{
    connUser
        .find()
        .exec((err, response)=>{
        if(err) throw err 
        cb(response)
    })
}
conectar.verificaCorreo = (dato, cb)=>{
    connUser
        .findOne({correo:dato}).countDocuments()
        .exec((err, result)=>{
        if(err) throw err
        cb(result)
    })
}
conectar.insertarUsuario = (data, cb)=>{
    connUser.create(data,(err)=>{
            if(err) throw err
            cb({correo:data.correo, contrasena: data.contrasena})
        })
}
conectar.insertarImagenUsu = (dato, correo, cb)=>{
    connUser.updateOne({correo:correo},{$set:dato})
            .exec((err)=>{
                if(err) throw err
                cb(dato)
            })
}
conectar.iniciarsession = (dato, cb)=>{
    connUser.findOne(dato).countDocuments()
        .exec((err,result)=>{
        if(err) throw err
        cb(result)
    })
}
conectar.traerInfoUser = (dato, cb)=>{
    connUser.find({correo:dato},{contrasena:false})
        .exec((err,response)=>{
        if(err) throw err;
        cb(response)
    })
}
conectar.sumar = (correo, hoy, cantidad, cb)=>{
    let a = new Date(hoy)
    let dia = Date.parse(new Date(`${a.getMonth()+1}/${a.getDate()}/${a.getFullYear()}`))
    connUso.updateOne(
        {
            usuario:correo, 
            'dias.dia':dia
        },
        {
            $inc:{
                'dias.$.puntos':cantidad
            }
        })
        .exec((err)=>{
        if(err) throw err
        cb()
    })
}
conectar.crearSumarEntrada = (correo, hoy,tipo, puntos, cb)=>{
    connUso.find({usuario:correo}).countDocuments()
        .exec((err, result)=>{
        if(err) throw err
        if(result === 0){
            connUso.create(
                {
                    usuario:correo, 
                    dias:[
                        {
                            dia:hoy,
                            puntos:puntos
                        }
                    ]
                },
            (err)=>{
				if(err) throw err
				cb()
			})
        }
        else if(result === 1 && tipo === 'inicial'){
            connUso.find({usuario:correo, 'dias.dia':hoy}).countDocuments()
                .exec((err,response)=>{
                if(err) throw err
                if(response === 0){
                    connUso.updateOne(
                        {
                            usuario:correo
                        },
                        {
                            $push:{
                                dias:{
                                    dia:hoy, puntos:puntos
                                }
                            }
                        }
                    )
                    .exec((err)=>{
                        if(err) throw err
						cb()
                    })
                }
            })
        }
        else if(result === 1 && tipo === 'completar'){
            connUso.updateOne(
                {
                    usuario:correo, 
                    'dias.dia':hoy
                }, 
                {
                    $inc:{
                        'dias.$.puntos':puntos
                    }
                }
            )
            .exec((err)=>{
                if(err) throw err
				cb()
            })
        }
        else{
            console.log('ya incremento')
			cb()
        }
    })
}
conectar.addCalendar = (dato, cb)=>{
    connCalendar.create(dato, (err)=>{
        if(err) throw err
        cb('Guardado satisfactoriamente')
    })
}
conectar.infohoraCalendar = (dato,correo, cb)=>{
    connCalendar.find({'usuarios.correo':correo, $and:[{horaInit:{$lt:dato+3600000}},{horaFin:{$gte:dato}}]})
        .exec((err, response)=>{
            if(err) throw err
            cb(response)
        })
}
conectar.cambiarEstadoCalendar = (dato, cb)=>{
    connCalendar
        .updateOne({ _id:dato.idGeneral, "usuarios.correo":dato.correo},{$set:{"usuarios.$.estado":dato.cambio}})
        .exec((err)=>{
        if(err) throw err
        cb('bien')
    })
}
conectar.getCalendarUser = (correo, cb)=>{
    connCalendar
        .find({'usuarios.correo':correo})
        .exec((err,response)=>{
        if(err) throw err
        cb(response)
    })
}
conectar.getCalendarUser1 = (correo, cb)=>{
    connCalendar
        .find({'usuarios.correo':correo},{horaInit:true, horaFin:true, estado:true})
        .exec((err,response)=>{
        if(err) throw err
        cb(response)
    })
}
conectar.getAllCalendar = (correo, inicial, final, cb)=>{
    connCalendar
        .find({usuario:correo, $and:[{horaInit:{$gte:inicial}},{horaInit:{$lte:final-1000}}]})
        .exec((err, response)=>{
            if(err) throw err;
            cb(response)
        })
}
conectar.getHours = (correo,dato,cb)=>{
    connCalendar
        .find({usuario:correo, $and:[{horaInit:{$gte:dato}},{horaInit:{$lte:dato+86399000}}]})
        .exec((err,response)=>{
            if(err) throw err
            cb(response)
        })
}
conectar.deleteCalendar = (id,usuario, cb)=>{
    connCalendar.deleteOne({_id:id, usuario:usuario}, (err, result)=>{
        if(err) throw err
        cb()
    })
}
conectar.editCalendar = (id, datos, cb)=>{
    connCalendar
        .updateOne({ _id:id },{$set:datos})
        .exec((err)=>{
        if(err) throw err
        cb()
    })
}
conectar.traerNotasRap = (correo, cb)=>{
    connNotas 
        .find({usuario:correo},{notas:true})
        .exec((err, response)=>{
            if(err) throw err
            cb(response)
        })
}
conectar.agregarNota = (correo, dato, color, cb)=>{
    connNotas
        .findOne({usuario:correo}).countDocuments()
        .exec((err, response)=>{
            if(err) throw err
            console.log(response)
            if(response !== 1){
                connNotas.create({usuario:correo, notas:[{texto:dato, color:color}]}, (err)=>{
                    if(err) throw err
                    cb()
                })
            }else{
                connNotas.updateOne({usuario:correo},{$push:{notas:{texto:dato, color:color}}})
                    .exec((err)=>{
                    if(err) throw err
                    cb()
                })
            }
        })
}
conectar.eliminarNota=(idG,idE, cb)=>{
    connNotas
        .updateOne({_id:idG},{$pull:{notas:{_id:idE}}})
        .exec((err)=>{
        if(err) throw err
        cb()
    })
}
conectar.editarNota = (idG,idE,texto,color,cb)=>{
    connNotas
        .updateOne({_id:idG, "notas._id":idE},{$set:{"notas.$.texto":texto, "notas.$.color":color}})
        .exec((err)=>{
        if(err) throw err
        cb()
    })
}

conectar.agregarTarea = (dato, cb)=>{
    connTareas
        .create(dato, (err)=>{
        if(err) throw err
        cb()
    })
}
conectar.buscarTareas = (correo, cb)=>{
    connTareas.find({implicados:correo}, {tarea:true,estado:true, fechaInit:true})
        .exec((err,result)=>{
        if(err) throw err
        cb(result)
    })
}
conectar.buscarTareas1 = (id,correo, cb)=>{
    connTareas.findOne({_id:id, implicados:correo})
        .exec((err,result)=>{
        if(err) throw err
        cb(result)
    })
}
conectar.editarTarea = (id, tarea, cb)=>{
    ////////////////////////////////////////////////////////
}
conectar.buscarTarea = (id, cb)=>{
    connTareas
        .find({_id:id},{comentarios:true, _id:false})
        .exec((err,response)=>{
        if(err) throw err
        cb(response)
        })
}
conectar.eliminarTarea = (id, cb)=>{
    connTareas.deleteOne({_id:id}, (err)=>{
        if(err) throw err
        cb()
    })
}
conectar.agregarComentario = (dato, id, cb)=>{
    connTareas.updateOne({_id:id},{$push:{comentarios:dato}},(err)=>{
        cb()
        })
}
conectar.cambiarEstado = (id, estado, cb)=>{
    connTareas.updateOne({_id:id},{$set:{estado:estado}}, (err)=>{
        if(err) throw err
        cb()
    })
}
/*conectar.like = (id, dato, cb)=>{
    connTareas
        .findOne({_id:id,"likes.emiLike":dato.emiLike}).count()
        .exec((err, result)=>{
        if(err) throw err
        if(result == 0){
            connTareas.update({_id:id},{$addToSet:{likes:dato}}, (err)=>{
                if(err) throw err
                cb()
            })
        }else{
            connTareas.update({_id:id, "likes.emiLike":dato.emiLike},{$set:{"likes.$.likeTru":dato.likeTru}}, (err)=>{
                if(err) throw err
                cb()
            })
        }
    })
}*/
conectar.crearRecordatorios = (usuario, cb)=>{
	connRecord
       .create({usuario:usuario, recordatorios:[]}, (err)=>{
        if(err) throw err
        cb()
    })
}
conectar.traerRecordatorios = (usuario, cb)=>{
    connRecord
        .findOne({usuario:usuario})
        .exec((err, result)=>{
        if(err) throw err
        cb(result)
    })
}
conectar.editarRecord = (idG, id, recordatorio, cb)=>{
    connRecord
        .updateOne({_id:idG, "recordatorios._id":id},{$set:{"recordatorios.$":recordatorio}})
        .exec((err)=>{
        if(err) throw err
        cb()
    })
}

conectar.agregarRecord = (id, recordatorio, cb)=>{
	connRecord
         .updateOne({_id:id},{$push:{recordatorios:recordatorio}})
         .exec((err)=>{
         if(err) throw err
         cb()
     })
}
conectar.eliminarRecordatorio =(idG, id, cb)=>{
    connRecord
        .updateOne({_id:idG,},{$pull:{recordatorios:{_id:id}}})
        .exec((err)=>{
        if(err) throw err
        cb()
    })
}
conectar.getBuscarUser =(dato, cb)=>{
    connUser
        .find({$or:[{nombre:{$regex:dato, $options:'i'}},{apellido:{$regex:dato, $options:'i'}},{correo:{$regex:dato, $options:'i'}}]},{nombre:true,correo:true,imagenLink:true})
        .exec((err,response)=>{
        if(err) throw err
        cb(response)
    })
}
conectar.traerUserBuscado = (correo, cb)=>{
    connUser
        .findOne({correo:correo},{contrasena:false})
        .exec((err,response)=>{
            if(err) throw err
            cb(response)
        })
}
conectar.buscarImagen =(correo, cb)=>{
    connUser
        .findOne({correo:correo},{imagenLink:true})
        .exec((err,response)=>{
        if(err)throw err
        cb(response)
    })
}
conectar.enviarsolicitud = (remitente, emisor, dato, cb)=>{
    let s = `${remitente}/${emisor}`
    connEquipo.create({conexion:s, uno:remitente, dos:emisor, estado:dato}),(err)=>{
        if(err)throw err
        return cb()
    }
}
conectar.solicitudEnviada = (correo, dato, remitente, cb)=>{
    connUser
        .updateOne({correo: correo},{$addToSet:{usuariosTrab:{conexion:dato, estado:'pendiente', remitente:remitente}}})
        .exec((err)=>{
        if(err) throw err
        return cb()
    })
}
conectar.traercompanero = (correo, cb)=>{
   connUser
        .findOne({correo:correo}, {correo:true,nombre:true,apellido:true,imagenLink:true})
        .exec((err,response)=>{
        if(err) throw err
        cb(response)
    })
}
conectar.traerConexion = (conexion, cb)=>{
    connEquipo
        .findOne({conexion:conexion})
        .exec((err,response)=>{
        if(err) throw err
        cb(response)
    })
}
conectar.getAllCompanero =(correo, cb)=>{
    console.log(correo)
    connEquipo
        .find({conexion:{$regex:correo}})
        .exec((err, result)=>{
        if(err) throw err
        cb(result)
    })
}
conectar.getUso = (correo,dia,cb)=>{
    connUso
        .find({usuario:correo, 'dias.dia':{$gte:dia}})
        .exec((err,response)=>{
        if(err) throw err
        cb(response)
    })
}
conectar.enviarSolicitudColaboracion= (dato,cb)=>{
    connEquipo.create(dato, (err)=>{
        if(err) throw err
        conectar.crearConexionUsuario(dato.uno, {conexion:dato.conexion, estado:dato.estado})
        conectar.crearConexionUsuario(dato.dos, {conexion:dato.conexion, estado:dato.estado})
        cb()
    })
}
conectar.crearConexionUsuario = (usuario, conex)=>{
    connUser
        .updateOne({correo:usuario},{$push:{usuariosTrab:conex}})
        .exec((err,result)=>{
        if(err) throw err
        console.log('creado')
    })
}
conectar.cancelarSolicitudColaboracion = (dato, cb)=>{
    let r = dato.conexion.split('/'),
        conex2 = r[1]+'/'+r[0]
    connEquipo.deleteOne({$or:[{conexion:dato.conexion},{conexion:conex2}]}, (err,response)=>{
        if(err) throw err
        conectar.cancelarSolicitudUsuario(dato.uno, dato.conexion)
        conectar.cancelarSolicitudUsuario(dato.dos, dato.conexion)
        cb()
    })
}
conectar.cancelarSolicitudUsuario = (usuario, conex)=>{
    let r = conex.split('/'),
        conex2 = r[1]+'/'+r[0]
    connUser
        .updateOne({correo:usuario},{$pull:{usuariosTrab:{$or:[{conexion:conex},{conexion:conex2}]}}})
        .exec((err,result)=>{
        if(err) throw err
        console.log('cancelado')
    })
}
conectar.aceptarSolicitudColaboracion = (data, cb)=>{
    let r = data.conexion.split('/'),
        conex2 = r[1]+'/'+r[0]
    connEquipo
        .updateMany({$or:[{conexion:data.conexion},{conexion:conex2}]},{$set:{inicial:data.inicial, estado:data.estado}})
        .exec((err,response)=>{
        if(err) throw err
        conectar.aceptarSolicitudUsuario(data.uno, data, conex2)
        conectar.aceptarSolicitudUsuario(data.dos, data, conex2)
        cb()
    })
}
conectar.aceptarSolicitudUsuario = (usuario, data,conex2)=>{
    connUser
        .updateOne({correo:usuario, $and:[{'usuariosTrab.conexion':{$regex:data.uno}},{'usuariosTrab.conexion':{$regex:data.dos}}]}, {$set:{'usuariosTrab.$.estado':data.estado}})
        .exec((err,result)=>{
        if(err) throw err
        console.log('aceptado')
    })
}
conectar.usuarioOver = (correo, cb)=>{
    connUser
        .findOne({correo:correo},{imagenLink:true,nombre:true,apellido:true})
        .exec((err,response)=>{
        if(err) throw err
        cb(response)
    })
}
/*conectar.crearProyecto = (id,envio, cb)=>{
    connUser
        .update({_id:id},{$push:{proyectos:envio}})
        .exec((err,result)=>{
        if(err) throw err
        for(let a = 0;a<envio.implicados.length;a++){
            if(envio.creador !== envio.implicados[a]){
                conectar.crearProyectoColaborador(envio, envio.implicados[a])
            }
        }
        cb()
    })
}*/
conectar.crearProyectoColaborador = (creador, proyecto, newUser, cb)=>{
    connProject
        .updateOne({creador:creador, nombre:proyecto},{$push:{implicados:newUser}})
        .exec((err)=>{
        if(err) throw err
        cb()
    })
}
conectar.getProyectoTareas = (nameProject, emailUser, cb)=>{
    connTareas
        .find({proyecto:nameProject, implicados:emailUser}, {implicados:true, fechaInit:true, tarea:true, estado:true})
        .exec((err, result)=>{
        if(err) throw err
        cb(result)
    })
}
conectar.getProyectoCalendar = (nameProject, emailUser, cb)=>{
    connCalendar
        .find({proyecto:nameProject, 'usuarios.correo':emailUser},{horaFin:true, usuario:true, contenido:true})
        .exec((err, result)=>{
        if(err) throw err
        cb(result)
    })
}
conectar.getProyecto = (proyecto, correo, cb)=>{
	connProject
		.findOne({nombre:proyecto, implicados:correo},{msg:false})
		.exec((err, result)=>{
		if(err) throw err
		cb(result)
	})
}
conectar.addUserProject = (principal, name, completo)=>{
    connUser.updateOne(
        {
            correo:principal, 
            'proyectos.nombre':name
        },
        {
            'proyectos.$':completo
        }
    )
        .exec((err)=>{
        if(err) throw err
    })
}
conectar.addUserCalendarios = (usuario, proyecto, newUser, cb)=>{
    connCalendar
        .updateMany({usuario:usuario, proyecto:proyecto},{$push:{usuarios:newUser}}, {multi:true})
        .exec((err)=>{
        if(err) throw err
		cb()
    })
}
conectar.addUserTareas = (usuario, proyecto, newUser, cb)=>{
    connTareas
        .updateMany({usuario:usuario, proyecto:proyecto},{$push:{implicados:newUser}}, {multi:true})
		.exec((err)=>{
			if(err) throw err
			console.log('completado')
			cb()
		})
}
conectar.projectCompletadoUser = (usuario, proyecto, estado, cb)=>{
	connProject
		.updateMany({nombre:proyecto, creador:usuario}, {$set:{estado:estado}}, {multi:true})
		.exec((err)=>{
        if(err) throw err
		console.log('completado')
        cb()
    })
}
conectar.projectCompletadoTareas = (usuario, proyecto, estado, cb)=>{
    connTareas
        .updateMany({proyecto:proyecto, implicados:usuario},{$set:{estado:estado}}, {multi:true})
        .exec((err)=>{
        if(err) throw err
        console.log('completado')
		cb()
    })
}
conectar.projectCompletadoCalendarios = (usuario, proyecto, estado, cb)=>{
    connCalendar
        .updateMany({proyecto:proyecto, 'usuarios.correo':usuario}, {$set:{estado:estado}}, {multi:true})
        .exec((err)=>{
        if(err) throw err
        console.log('completado')
		cb()
    })
}
conectar.projectEliminar = (usuario, proyecto, cb)=>{
    connProject
        .deleteOne({creador:usuario, nombre:proyecto}, (err)=>{
		if(err) throw err
		console.log('proyecto Eliminado')
        cb()
	})
}
conectar.deleteCalendar2 = (usuario, proyecto, cb)=>{
    connCalendar.deleteOne({usuario:usuario, proyecto:proyecto}, (err, result)=>{
        if(err) throw err
        cb()
    })
}
conectar.eliminarTarea2 = (usuario, proyecto, cb)=>{
    connTareas.deleteOne({usuario:usuario, proyecto:proyecto}, (err)=>{
        if(err) throw err
        cb()
    })
}
conectar.eliminarParticipacionProject = (usuario, proyecto, cb)=>{
	connProject
		.updateOne({nombre:proyecto, implicados:usuario}, {$pull:{implicados:usuario}})
		.exec((err)=>{
		if(err) throw err
		connCalendar
			.updateOne({proyecto:proyecto, 'usuarios.correo':usuario}, {$pull:{usuarios:{correo:usuario}}}, {multi:true})
			.exec((err)=>{
			if(err) throw err
			connTareas
				.updateOne({proyecto:proyecto, implicados:usuario}, {$pull:{implicados:usuario}}, {multi:true})
				.exec((err)=>{
				if(err) throw err
				cb()
			})
		})
	})
    /*connUser
        .update({correo:usuario},{$pull:{proyectos:{nombre:proyecto}}})
        .exec((err)=>{
        if(err) throw err
        connUser
            .find({'proyectos.implicados':usuario, 'proyectos.nombre':proyecto},{'proyectos.implicados':true})
            .exec((err, result)=>{
            if(err) throw err
            console.log(result)
            result.forEach((item)=>{
                var id = item._id
                item.proyectos.forEach((item2)=>{
                    let a = item2.implicados,
                        b = a.indexOf(usuario),
                        c = a.splice(b,1)
                    connUser.update({_id:id, 'proyectos.nombre':proyecto},{$set:{'proyectos.$.implicados':a}})
                        .exec((err)=>{
                        if(err) throw err
                        console.log(usuario)
                    })
                })
            })
        })
    })*/
}
conectar.eliminarMinombreProject = (usuario, proyecto)=>{
    connUser
        .find({'proyectos.implicados':usuario, 'proyecto.nombre':proyecto},{'proyectos.implicados':true})
        .exec((err, result)=>{
        if(err) throw err
        console.log(usuario)
        result.forEach((item)=>{
            var id = item._id
            item.proyectos.forEach((item2)=>{
                let a = item2.implicados,
                    b = a.indexOf(usuario),
                    c = a.splice(b,1)
                connUser.updateMany({'proyectos.implicados':usuario},{$set:{'proyectos.$.implicados':a}})
                    .exec((err)=>{
                    if(err) throw err
                })
            })
        })
    })
}/*
conectar.eliminarParticipacionTareas = (usuario, proyecto)=>{
    
}
conectar.eliminarParticipacionCalendario = (usuario, proyecto)=>{
    
}*/
conectar.buscarProject = (correo, cb)=>{
	connProject
		.find({implicados:correo}, {msg:false})
		.exec((err,result)=>{
		if(err) throw err
		cb(result)
	})
}
conectar.buscarProject2 = (correo, proyecto, cb)=>{
	connProject
		.findOne({implicados:correo, nombre:proyecto})
		.exec((err,result)=>{
		if(err) throw err
		cb(result)
	})
}
conectar.buscarProject3 = (correo,cb)=>{
    connProject
		.find({implicados:correo}, {nombre:true})
		.exec((err,result)=>{
		if(err) throw err
		cb(result)
	})
}
conectar.addProject = (informacion, cb)=>{
	connProject
		.findOne({nombre:informacion.nombre, implicados:{$in:informacion.implicados}}).countDocuments()
		.exec((err,result)=>{
		if(err) throw err
		if(result === 0){
			connProject.create(informacion, (err)=>{
				if(err) throw err
				cb('si')
			})
		}else{
			cb('no')
		}
	})
}
//Chat

conectar.getProjectSimple = (correo, cb)=>{
	connProject
		.find({implicados:correo}, {msg:true, nombre:true, estado:true, ultimo:true})
		.exec((err, result)=>{
		if(err) throw err
		cb(result)
	})
}
conectar.buscarMensajes = (id, cb)=>{
	connProject.findOne({_id:id},{msg:true, implicados:true}, (err, result)=>{
		if(err) throw err
		cb(result)
	})
}
conectar.guardarMensaje = (id, inform, cb)=>{
	connProject
		.updateOne({_id:id},{$push:{msg:inform}})
		.exec((err)=>{
		if(err) throw err;
		connProject.findOne({_id:id}, {implicados:true}, (error, result)=>{
			if(err) throw err
			cb(result)
		})
	})
}
conectar.vistoChat = (id,ids, correo, cb)=>{
	connProject
		.updateOne({_id:id, 'msg._id':ids},{$addToSet:{'msg.$.recibido':correo}})
		.exec((err)=>{
		if(err) throw err
		cb()
	})
}
conectar.vistoChat2 = (id,fecha,correo, cb)=>{
	connProject
		.updateOne({_id:id, 'msg.fecha':fecha},{$addToSet:{'msg.$.recibido':correo}})
		.exec((err)=>{
		if(err) throw err
		connProject
			.findOne({_id:id}, {msg:true})
			.exec((err,resp)=>{
			if(err) throw err
			cb(resp)
		})
	})
}
conectar.buscarNcalendario = (usuario, fecha, cb)=>{
	connCalendar
		.find({'usuarios.correo':usuario, estado:'pendiente', horaFin:{$lt:fecha}},{horaFin:true, contenido:true})
		.exec((err,response)=>{
		if(err) throw err
		cb(response)
	})
}
conectar.buscarNrecordatorio = (usuario, fecha, cb)=>{
	connRecord
		.aggregate([
		{$match:{usuario:usuario}},
		{$unwind:'$recordatorios'},
		{$match:{'recordatorios.limite':{$lt:fecha+86400000}}},
	 	{$group:{_id:'$_id', recordatorios:{$push:'$recordatorios'}}}
		])
		.exec((err,result)=>{
		if(err) throw err
		cb(result)
	})
}
conectar.buscarNtarea = (usuario, cb)=>{
	connTareas
		.find({implicados:usuario, estado:'pendiente'},{tarea:true})
		.exec((err,response)=>{
		if(err) throw err
		cb(response)
	})
}
conectar.buscarNequipo = (usuario,cb)=>{
	connEquipo
		.find({dos:usuario, estado:'pendiente'},{uno:true})
		.exec((err,response)=>{
		if(err) throw err
		cb(response)
	})
}
conectar.buscarNmensajes = (usuario, cb)=>{
	connProject
		.aggregate([
		{$match:{implicados:usuario}},
		{$unwind:'$msg'},
		{$project:{index:{$indexOfArray:['$msg.recibido', usuario]}}}
	])
	.exec((err,response)=>{
		if(err) throw err
		var s = response.filter(item => item.index === -1)
		cb(s)
	})
}
conectar.agregarInfoMejora = (dato, cb)=>{
    connVista.create(dato, (err)=>{
        if(err) throw err
        cb()
    })
}
conectar.contrasena =(correo, numero, cb)=>{
    let num = parseInt(numero)
    console.log(num)
    connUser
        .updateOne({correo:correo},{$set:{recu:num}})
        .exec((err)=>{
        if(err)throw err
        cb()
    })
}
conectar.verificaCodigo=(code, cb)=>{
    connUser
        .findOne({recu:code}).countDocuments()
        .exec((err,result)=>{
        if(err)throw err
        cb(result)
    })
}
conectar.newContrasena=(correo,contra,cb)=>{
    connUser
        .updateOne({correo:correo},{$set:{contrasena:contra}})
        .exec((err,result)=>{
        if(err)throw err
        cb()
    })
}
module.exports = conectar