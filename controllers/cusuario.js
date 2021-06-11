const conexion = require('../database/db');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});


exports.save = async(req, res)=> {
    const CI = req.body.CI;
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    let passwordHassh = await bcryptjs.hash(contrasena, 8);
    const nombre = req.body.nombre;
    const primer_apellido = req.body.primer_apellido;
    const segundo_apellido = req.body.segundo_apellido;
    const cargo = req.body.cargo;
    const rol = req.body.rol;
    
    conexion.query('INSERT INTO usuario SET ?', {CI:CI, usuario:usuario, contrasena: passwordHassh, nombre:nombre, primer_apellido:primer_apellido, segundo_apellido: segundo_apellido, cargo:cargo, rol:rol}, async (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/mostrarusuarios'); 
         }
    }) 
}

exports.update = async(req, res)=> {
    const id_usuario = req.body.id_usuario;
    const CI = req.body.CI;
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    let passwordHassh = await bcryptjs.hash(contrasena, 8);
    const nombre = req.body.nombre;
    const primer_apellido = req.body.primer_apellido;
    const segundo_apellido = req.body.segundo_apellido;
    const cargo = req.body.cargo;
    const rol = req.body.rol;

    if(req.body.contrasena){  
    conexion.query('UPDATE usuario SET ? WHERE id_usuario = ?',[{CI:CI, usuario:usuario, contrasena: passwordHassh, nombre:nombre, primer_apellido:primer_apellido, segundo_apellido: segundo_apellido, cargo:cargo, rol:rol}, id_usuario], async(error, results)=>{
         if (error) {
             console.log(error)
         } else {             
             res.redirect('/mostrarusuarios');             
         }
    })
  } else {
    conexion.query('UPDATE usuario SET ? WHERE id_usuario = ?',[{CI:CI, usuario:usuario, nombre:nombre, primer_apellido:primer_apellido, segundo_apellido: segundo_apellido, cargo:cargo, rol:rol}, id_usuario], (error, results)=>{
        if (error) {
            console.log(error)
        } else {             
            res.redirect('/mostrarusuarios');
            
        }
   })
  }  
}

exports.delete = (req, res)=> {
    const id_usuario = req.paramas.id_usuario;
    conexion.query('UPDATE usuario SET ? WHERE id_usuario = ?',[id_usuario], (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/mostrarusuarios');
         }
    }) 
}