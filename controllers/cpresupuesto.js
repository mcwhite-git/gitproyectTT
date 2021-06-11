const conexion = require('../database/db');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});


exports.save = (req, res)=> {
    const id_ueb = req.body.id_ueb;
    const fecha = req.body.fecha;
    const cmpmn = req.body.cmpmn;    
    const cmpcl = req.body.cmpcl;
    
    conexion.query('INSERT INTO presupuesto SET ?', {uebid_ueb: id_ueb, fecha: fecha, cmpmn: cmpmn, cmpcl: cmpcl}, (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/asignarpresupuesto'); 
         }
    }) 
}

exports.updatepresupuesto = (req, res)=> {
    const id_ueb = req.body.id_ueb;
    const fecha = req.body.fecha;
    const cmpmn = req.body.cmpmn;    
    const cmpcl = req.body.cmpcl;

    
    conexion.query('UPDATE presupuesto SET ? WHERE id_presupuesto = ?',[{uebid_ueb: id_ueb, fecha: fecha, cmpmn: cmpmn, cmpcl: cmpcl}, id_presupuesto], (error, results)=>{
         if (error) {
             console.log(error)
         } else {             
             res.redirect('/asignarpresupuesto');             
         }
    })
}

exports.delete = (req, res)=> {
    const id_presupuesto = req.paramas.id_presupuesto;
    conexion.query('UPDATE presupuesto SET ? WHERE id_presupuesto = ?',[id_presupuesto], (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/asignarpresupuesto');
         }
    }) 
}