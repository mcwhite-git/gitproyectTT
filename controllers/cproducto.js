const conexion = require('../database/db');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

exports.save = (req, res)=> { 
    const codigo = req.body.codigo;     
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const categoria = req.body.categoria;
    const uebid_ueb = req.body.ueb;    
    
    conexion.query('INSERT INTO producto SET ?', {codigo:codigo, nombre:nombre, descripcion:descripcion, categoria: categoria, uebid_ueb:uebid_ueb}, (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/mostrarproductos');
         }
    }) 
};

exports.updateprod = (req, res)=> {
    const id_producto = req.body.id_producto;
    const codigo = req.body.codigo; 
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const categoria = req.body.categoria;
    const uebid_ueb = req.body.ueb;
    
    conexion.query('UPDATE producto SET ? WHERE id_producto = ?',[{codigo:codigo, nombre:nombre, descripcion:descripcion, categoria: categoria, uebid_ueb:uebid_ueb}, id_producto], (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/mostrarproductos');
         }
    }) 
}

exports.deleteprod = (req, res)=> {
    const id_producto = req.paramas.id_producto;
    conexion.query('UPDATE producto SET ? WHERE id_producto = ?',[id_producto], (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/mostrarproductos');
         }
    }) 
}