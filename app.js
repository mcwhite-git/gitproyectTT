const { json } = require('express');
//invocamos express
const express = require('express')
const app = express();
const path = require('path');
const {body, validationResults} = require ('express-validator');

//cambiando el modo de cargar las vistas

//invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});


//establecer el motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//variables de session
const session = require('express-session');
app.use(session({
   secret:'secret',
   resave:true,
   saveUninitialized:true
}));



app.use('/css', express.static(path.join(__dirname, 'public/css')))
app.use('/js', express.static(path.join(__dirname, 'public/js')))
app.use('/img', express.static(path.join(__dirname, 'public/img')))
app.use('/vendor', express.static(path.join(__dirname, 'public/vendor')))

//seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express(json));

app.use('/', require('./router'));

app.listen(5000, () => {
  console.log('Listening on port ' + 5000);
});
