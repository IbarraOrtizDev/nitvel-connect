'use strict'
var express = require('express'),
    router = express.Router(),
    path = require('path'),
    controlador = require('../controlador/controlador.js'),
	fs = require('fs'),
	fse = require('fs-extra'),
	multer = require('multer'),
	upload = multer({dest:'uploads'}),
	aut = require('./aut.js')

router
    //.get('/', (req,res)=>{res.sendFile(path.join(__dirname, '../public', 'gestion.html'))})
    //.get('/usuarios', controlador.getUser)
    .get('/correo/:email', controlador.verificaCorreo)
    .post('/guardar/usuario', controlador.insertarUsuario)
	.post('/imagenUsu', upload.single('imagen'),aut, controlador.insertarImagenUsu)
    .post('/iniciarsession', controlador.iniciarsession)
    .get('/traerInfoUser/:horaHoy',aut, controlador.traerInfoUser)

    .post('/addCalendar', controlador.addCalendar)
    .get('/infohoraCalendar/:dato', aut, controlador.infohoraCalendar)
    .post('/cambiarEstadoCalendar', controlador.cambiarEstadoCalendar)
    .get('/getCalendarUser',aut, controlador.getCalendarUser)
    //.post('/getAll/:correo', controlador.getAllCalendar)
    //.get('/getHours/:correo/:dato', controlador.getHours)
    .post('/deleteCalendar',aut,controlador.deleteCalendar)
    .post('/editCalendar/:id', controlador.editCalendar)

    .get('/traerNotasRap',aut, controlador.traerNotasRap)
    .post('/agregarNota', controlador.agregarNota)
    .post('/eliminarNota', controlador.eliminarNota)
    .post('/editarNota', controlador.editarNota)

    .post('/agregarTarea', controlador.agregarTarea)
    .get('/buscarTareas',aut, controlador.buscarTareas)
    .get('/buscarTareas1/:id',aut, controlador.buscarTareas1)
    .get('/buscarTareas1/:id1/:id2', controlador.buscarTareas2)
    //.post('/editarTarea/:correo', controlador.editarTarea)
    //.get('/buscarTarea/:id', controlador.buscarTarea)
    .post('/eliminarTarea', controlador.eliminarTarea)
    .post('/agregarComentario', controlador.agregarComentario)
	.post('/agregarComentarioAdjunto', controlador.agregarComentarioAdjunto)
    .post('/cambiarEstado', controlador.cambiarEstado)
    //.post('/like/:id', controlador.like)//

    .get('/traerRecordatorios', aut, controlador.traerRecordatorios)
    .post('/editarRecord/:idG/:id', controlador.editarRecord)
    .post('/agregarRecord', controlador.agregarRecord)
    .post('/eliminarRecordatorio/:idG/:id', controlador.eliminarRecordatorio)

    .get('/getBuscarUser/:user', controlador.getBuscarUser)
    .get('/traerUserBuscado/:correo',controlador.traerUserBuscado)
    //.get('buscar/imagen/:correo', controlador.buscarImagen)
    //.post('/enviarsolicitud/:correo', controlador.enviarsolicitud)
    //.post('/traercompanero/:correo', controlador.traercompanero)
    .get('/traercompanero/:correo', controlador.traercompanero2)
    //.post('/traerConexion', controlador.traerConexion)
    //.get('/getAllCompanero/:correo', controlador.getAllCompanero)
    .get('/getUso/:dia/:correo', controlador.getUso)
    .post('/enviarSolicitudColaboracion', controlador.enviarSolicitudColaboracion)
    .post('/cancelarSolicitudColaboracion', controlador.cancelarSolicitudColaboracion)
    .post('/aceptarSolicitudColaboracion', controlador.aceptarSolicitudColaboracion)
    .get('/usuarioOver/:correo', controlador.usuarioOver)

    //.post('/crearProyecto/:id', controlador.crearProyecto)
    .get('/getProyecto/:proyecto',aut, controlador.getProyecto)
	.get('/buscarProject',aut, controlador.buscarProject)
	.get('/buscarProject3/:correo',aut, controlador.buscarProject3)
	.post('/addProject', controlador.addProject)
    .post('/addUserProject/simple', controlador.addUserProjectSimple)
    .post('/addUserProject/todo', controlador.addUserProjectTodo)

    //.post('/addUserCalendarTareas', controlador.addUserCalendarTareas)
    .post('/projectCompletado', controlador.projectCompletado)
    .post('/eliminarProject', controlador.eliminarProject)
    .post('/eliminarParticipacion/:correo/:proyecto', controlador.eliminarParticipacion)
//Chat
	.get('/getProjectSimple',aut, controlador.getProjectSimple)

	.get('/buscarMensajes/:id',aut, controlador.buscarMensajes)
	.get('/buscarMensajes2/:id1/:id2', controlador.buscarMensajes2)

	.post('/visto/:id/:correo', controlador.vistoChat)
	
	.get('/buscarN/:fecha', aut, controlador.buscarN)

    .post('/agregarInfoMejora', controlador.agregarInfoMejora)
    .post('/cambioImagen/:correo', upload.single('imagen'),controlador.cambioImagen)
    .get('/contrasena', (req,res,next)=>{
        let local ={
        }
        res.render('aaa', local)

    })
    .get('/userCalendar/:correo', controlador.userCalendar)
    //.get('/userCalendar/:correo', controlador.contrasena)
    .post('/contrasena', controlador.contrasena)
    .post('/verificaCodigo', controlador.verificaCodigo)
    .post('/newContrasena', controlador.newContrasena)
module.exports = router