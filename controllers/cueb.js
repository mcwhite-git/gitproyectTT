const conexion = require('../database/db');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});


exports.save = (req, res)=> {
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    
    conexion.query('INSERT INTO ueb SET ?', {nombre:nombre, direccion: direccion}, (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/mostrarueb'); 
         }
    }) 
}

exports.updateueb = (req, res)=> {
    const id_ueb = req.body.id_ueb;
    const nombre = req.body.nombre;
    const direccion = req.body.direccion;
    
    conexion.query('UPDATE ueb SET ? WHERE id_ueb= ?',[{nombre:nombre, direccion:direccion}, id_ueb], (error, results)=>{
         if (error) {
             console.log(error)
         } else {             
             res.redirect('/mostrarueb');
             
         }
    }) 
}

exports.delete = (req, res)=> {
    const id_ueb = req.paramas.id_ueb;
    conexion.query('UPDATE ueb SET ? WHERE id_ueb = ?',[id_ueb], (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/mostrarueb');
         }
    }) 
}