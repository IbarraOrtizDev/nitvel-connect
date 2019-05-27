'use strict'
var express = require('express'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    restFull = require('express-method-override')('_method'),
    jade = require('jade'),
    rutas = require('./rutas/rutas.js'),
    publiDir =express.static(`${__dirname}/public`),
    vistasDir = `${__dirname}/vistas`,
    port = (process.env.PORT || 3000),
    app = express(),
    path = require('path')
console.log(vistasDir)
app
    .set('views', vistasDir)
    .set('view engine', 'jade')
    .set('port', port)
    
    .use(favicon(path.join(__dirname, 'public/logos/favicon.ico')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended:false}))
    .use(restFull)
    .use(morgan('dev'))
    .use(publiDir)
    .use(rutas)
module.exports = app