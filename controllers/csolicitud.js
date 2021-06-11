const conexion = require('../database/db');
const dotenv = require('dotenv');
dotenv.config({path:'./env/.env'});

exports.save = (req, res)=> {     
    const descripcion = req.body.descripcion;
    const resumen = req.body.resumen;
    const fecha = req.body.fecha;  
    const uebid_ueb = req.body.ueb;  
    const estado = req.body.estado;
    
    conexion.query('INSERT INTO solicitud SET ?', { descripcion:descripcion, resumen: resumen, fecha: fecha, uebid_ueb:uebid_ueb, estado:estado}, (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/crearsolicitud');
         }
    }) 
};

exports.updatesolicitud = (req, res)=> {
    const descripcion = req.body.descripcion;
    const resumen = req.body.resumen;
    const fecha = req.body.fecha;  
    const uebid_ueb = req.body.ueb;  
    const estado = req.body.estado;
    
    conexion.query('UPDATE solicitud SET ? WHERE id_solicitud = ?',[{descripcion:descripcion, resumen: resumen, fecha: fecha, uebid_ueb:uebid_ueb, estado:estado}, id_solicitud], (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/crearsolicitud');
         }
    }) 
}

exports.deletesolicitud = (req, res)=> {
    const id_solicitud = req.paramas.id_solicitud;
    conexion.query('UPDATE solicitud SET ? WHERE id_solicitud = ?',[id_solicitud], (error, results)=>{
         if (error) {
             console.log(error)
         } else {
             res.redirect('/crearsolicitud');
         }
    }) 
}