const express = require('express');
const router = express.Router();
const { body, validationResults } = require('express-validator');

const conexion = require('./database/db');

const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env' });

const session = require('express-session');


router.get('/login', (req, res) => {
    res.render('login.ejs');
    req.session.current_url = 'login'
})

router.get('/contactenos', (req, res) => {
    res.render('contactenos.ejs');
    req.session.current_url = 'contactenos'
})

router.get('/panelcontrol', (req, res) => {
    if (req.session.logeadoen) {
        res.render('panelcontrol', {
            login: true,
            nombre: req.session.nombre,
            rol: req.session.nombre
        })
    } else {
        res.render('index', {
            login: false,
            nombre: 'Debe iniciar sesión'
        })
    }
})

router.get('/index', (req, res) => {
    if (req.session.logeadoen) {
        res.render('index', {
            login: true,
            nombre: req.session.nombre,
            rol: req.session.rol
        })
    } else {
        res.render('index', {
            login: false,
            nombre: 'Debe iniciar sesión'
        })
    }
})

//-------Función para otorgar permisos-----------

function requireRole(rol) {
    return function (req, res, next) {
        if (req.session.rol === rol || req.session.rol === "Administrador") {
            next();
        } else {
            res.render('login', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "No tiene permisos para acceder a esta página",
                alertIcon: 'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'login'
            });
        }
    }
}

//---------funcion para obtener la ultima URL

// function getUrl (req, res) {   
//    const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
//     return fullUrl;
//   }

//-----------------------------------------------

router.get('/formcrearusuario', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {
        req.session.current_url = 'formcrearusuario'
        res.render('formcrearusuario', {
            login: true,
            nombre: req.session.nombre

        })
    } else {
        res.render('login');
    }
})

router.get('/editarusuario', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {
        req.session.current_url = 'editarusuario'
        res.render('editarusuario', {
            login: true,
            nombre: req.session.nombre
        })
    } else {
        res.render('login');
    }
})


//------Metodo de autenticación ------

router.post('/auth', async (req, res) => {
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    let passwordHassh = await bcryptjs.hash(contrasena, 8);
    if (usuario && contrasena) {
        conexion.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async (error, results) => {
            if (results.length == 0 || !(await bcryptjs.compare(contrasena, results[0].contrasena))) {
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "Usuario y/o contraseña incorrectos!",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            } else {
                req.session.logeadoen = true;
                req.session.nombre = results[0].nombre
                req.session.rol = results[0].rol
                res.render('login', {
                    alert: true,
                    alertTitle: "Conexión exitosa",
                    alertMessage: "Se ha autenticado satisfactoriamente!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 2000,
                    ruta: ''
                });
            }
        })
    } else {
        res.render('login', {
            alert: true,
            alertTitle: "Advertencia",
            alertMessage: "Por favor ingrese usuario y/o contraseña!",
            alertIcon: 'warning',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'
        });
    }

})

//-------Método index logeado---

router.get('/', (req, res) => {
    if (req.session.logeadoen) {
        req.session.current_url = '/'
        res.render('index', {
            login: true,
            nombre: req.session.nombre,
            rol: req.session.rol
        })
    } else {
        res.render('index', {
            login: false,
            nombre: 'Debe iniciar sesión'
        })
    }
})

//-----Método destruir sesión--------

router.get('/salir', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/')
    })
})

//-----------------Usuarios---------------------------------------
router.get('/mostrarusuarios', requireRole("Administrador"), (req, res) => {
    req.session.current_url = 'mostrarusuarios'
    if (req.session.logeadoen) {

        conexion.query('SELECT * FROM usuario', (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('mostrarusuarios', {
                    results: results,
                    login: true,
                    nombre: req.session.nombre,
                    rol: req.session.rol
                });
            }
        })
    } else {
        res.render('login');
    }
})


router.post('/formcrearusuario', async (req, res) => {

    const CI = req.body.CI;
    const usuario = req.body.usuario;
    const contrasena = req.body.contrasena;
    let passwordHassh = await bcryptjs.hash(contrasena, 8);
    const nombre = req.body.nombre;
    const primer_apellido = req.body.primer_apellido;
    const segundo_apellido = req.body.segundo_apellido;
    const cargo = req.body.cargo;
    const rol = req.body.rol;

    conexion.query('INSERT INTO usuario SET ?', { CI: CI, usuario: usuario, contrasena: passwordHassh, nombre: nombre, primer_apellido: primer_apellido, segundo_apellido: segundo_apellido, cargo: cargo, rol: rol, }, async (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.render('formcrearusuario', {
                alert: true,
                alertTitle: "Usuario Agregado",
                alertMessage: "El usuario se agregó con exito",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 2800,
                ruta: 'mostrarusuarios',
                login: true,
                nombre: req.session.nombre,
                passw: req.session.contrasena

            })
        }
    })

})


router.get('/editarusuario/:id_usuario', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {
        const id_usuario = req.params.id_usuario;
        conexion.query('SELECT * FROM usuario WHERE id_usuario = ?', [id_usuario], (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('editarusuario', {
                    usuario: results[0],
                    login: true,
                    nombre: req.session.nombre
                });
            }
        })
    } else {
        res.render('login');
    }
})



router.get('/delete/:id_usuario', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {
        const id_usuario = req.params.id_usuario;
        conexion.query('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario], (error, results) => {
            if (error) {
                throw error;
            } else {
                res.redirect('/mostrarusuarios');
            }
        })
    } else {
        res.render('login');
    }

})

const cusuario = require('./controllers/cusuario');
//router.post('/save', cusuario.save);
router.post('/update', cusuario.update);

//--------------------Productos---------------------------------------------------

router.get('/mostrarproductos', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {
        conexion.query('SELECT * FROM producto', (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('mostrarproductos', {
                    results: results,
                    login: true,
                    nombre: req.session.nombre
                });
            }
        })
    } else {
        res.render('login');
    }
})

router.get('/formcrearproducto', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {
        conexion.query('SELECT * FROM ueb', (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('formcrearproducto', {
                    results: results,
                    login: true,
                    nombre: req.session.nombre
                });
            }
        })
    } else {
        res.render('login');
    }
})

router.post('/formcrearproducto', requireRole("Administrador"), (req, res) => {
    const codigo = req.body.codigo;
    const nombre = req.body.nombre;
    const descripcion = req.body.descripcion;
    const uebid_ueb = req.body.ueb;
    const categoria = req.body.categoria;

    conexion.query('INSERT INTO producto SET ?', { codigo: codigo, nombre: nombre, descripcion: descripcion, uebid_ueb: uebid_ueb, categoria: categoria, }, (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.redirect('mostrarproductos');
        }
    })
})

// function uebs() {
//     return function (req, res, next) {
//         conexion.query('SELECT * FROM ueb');
//     }
// }

/*router.get('/editarproducto/:id_producto', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {   
        const uebdata = conexion.query('SELECT * FROM ueb');        
        const id_producto = req.params.id_producto;
        conexion.query('SELECT * FROM producto WHERE id_producto = ?', [id_producto], (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('editarproducto', {
                    producto: results[0],
                    ueb: uebdata[0],                    
                    login: true,
                    nombre: req.session.nombre,
                    rol: req.session.rol,                    
                    
                });
            }
        })
    } else {
        res.render('login');
    }
})*/

router.get('/deleteprod/:id_producto', requireRole("Administrador"), (req, res) => {
    const id_producto = req.params.id_producto;
    conexion.query('DELETE FROM producto WHERE id_producto = ?', [id_producto], (error, results) => {
        if (error) {
            throw error;
        } else {
            res.redirect('/mostrarproductos');
        }
    })
})


const cproducto = require('./controllers/cproducto');
//router.post('/save', cproducto.save);
router.post('/updateprod', cproducto.updateprod);



//---------------------------UEB---------------------------------------------------

router.get('/mostrarueb', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {

        conexion.query('SELECT * FROM ueb', (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('mostrarueb', {
                    results: results,
                    login: true,
                    nombre: req.session.nombre
                });
            }
        })
    } else {
        res.render('login');
    }
})

router.get('/formcrearueb', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {
        res.render('formcrearueb.ejs', {
            login: true,
            nombre: req.session.nombre
        });
    } else {
        res.render('login');
    }
})

router.get('/editarueb/:id_ueb', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {
        const id_ueb = req.params.id_ueb;
        conexion.query('SELECT * FROM ueb WHERE id_ueb = ?', [id_ueb], (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('editarueb', {
                    ueb: results[0],
                    login: true,
                    nombre: req.session.nombre
                });
            }
        })
    } else {
        res.render('login');
    }
})


router.get('/deleteueb/:id_ueb', requireRole("Administrador"), (req, res) => {
    if (req.session.logeadoen) {
        const id_ueb = req.params.id_ueb;
        conexion.query('DELETE FROM ueb WHERE id_ueb = ?', [id_ueb], (error, results) => {
            if (error) {
                throw error;
            } else {
                res.redirect('/mostrarueb');
            }
        })
    } else {
        res.render('login');
    }

})

router.post('/formcrearueb', (req, res) => {

    const nombre = req.body.nombre;
    const direccion = req.body.direccion;


    conexion.query('INSERT INTO ueb SET ?', { nombre: nombre, direccion: direccion }, (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.render('formcrearueb', {
                alert: true,
                alertTitle: "UEB Agregada",
                alertMessage: "La UEB se agregó con exito",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 2800,
                ruta: 'mostrarueb',
                login: true,
                nombre: req.session.nombre
            })
        }
    })

})

const cueb = require('./controllers/cueb');
router.post('/updateueb', cueb.updateueb);


//---------------------------Solicitudes----------------------------------------------------



router.get('/crearsolicitud', requireRole("DirUEB"), (req, res) => {
    if (req.session.logeadoen) {
        res.render('crearsolicitud', {
            login: true,
            nombre: req.session.nombre,
            rol: req.session.rol
        })
    } else {
        res.render('login');
    }
}) 

router.post('/crearsolicitud', (req, res) => {
     const descripcion = req.body.descripcion;
     const resumen = req.body.resumen;
     const fecha = req.body.fecha;  
     const uebid_ueb = req.body.ueb;  
     const estado = req.body.estado;
     conexion.query('INSERT INTO solicitud SET ?', { descripcion:descripcion, resumen: resumen, fecha: fecha, uebid_ueb:uebid_ueb, estado:estado}, (error, results) => {
         if (error) {
             console.log(error)
         } else {
             res.render('crearsolicitud', {
                 alert: true,
                 alertTitle: "UEB Agregada",
                 alertMessage: "La UEB se agregó con exito",
                 alertIcon: 'success',
                 showConfirmButton: false,
                 timer: 2800,
                 ruta: 'crearsolicitud',
                 login: true,
                 nombre: req.session.nombre
             })
         }
     })

 })

const csolicitud = require('./controllers/csolicitud');
router.post('/updatesolicitud', csolicitud.updatesolicitud);

//----------------------------Presupuesto--------------------------------------------


router.get('/asignarpresupuesto', requireRole("DirUEB"), (req, res) => {
    if (req.session.logeadoen) {
        conexion.query('SELECT * FROM presupuesto', (error, results) => {
            if (error) {
                throw error;
            } else {
                res.render('asignarpresupuesto', { 
                    results: results,                   
                    login: true,
                    nombre: req.session.nombre,
                    rol: req.session.rol
                });
            }
        })        
    } else {
        res.render('login');
    }
})


router.post('/asignarpresupuesto', (req, res) => {

    const id_ueb = req.body.id_ueb;
    const fecha = req.body.fecha;
    const cmpmn = req.body.cmpmn;    
    const cmpcl = req.body.cmpcl;

    conexion.query('INSERT INTO presupuesto SET ?', { uebid_ueb: id_ueb, fecha: fecha, cmpmn: cmpmn, cmpcl: cmpcl},  (error, results) => {
        if (error) {
            console.log(error)
        } else {
            res.render('asignarpresupuesto', {
                alert: true,
                alertTitle: "Presupuesto Asignado",
                alertMessage: "El presupuesto se agregó con exito",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 2800,
                ruta: 'asignarpresupuesto',
                login: true,
                nombre: req.session.nombre,
                rol: req.session.rol,
                results: results
            })
        }
    })

})

const cpresupuesto = require('./controllers/cpresupuesto');
router.post('/updatepresupuesto', cpresupuesto.updatepresupuesto);

module.exports = router;



