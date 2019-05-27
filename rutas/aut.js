function descodo(params){
	var l = params.length,
		g = new Buffer(l)
	g.write(params+'=', 0, l, 'base64')
	return JSON.parse(g.toString('ascii').split('}')[0]+'}')
}
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
function autoriza(req, res,next){
	let datos = req.headers.authorization
	if(datos){
		let t = descodo(datos)
		if(t.correo && t.contrasena){
			req.vha={correo:des(t.correo),contrasena:des(t.contrasena)}
			next()
		}else{
			res.status(404).send('Token no valido')
		}
	}else{
		res.status(404).send('Debes registrarte o iniciar session')
	}
}
module.exports = autoriza