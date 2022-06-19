//esto es el servidor http
//con node js se ejecuta

///////////////////////////
//antes de lanzar el servidor se puede seguir configurando


// cargar el módulo para bases de datos SQLite
var sqlite3 = require('sqlite3').verbose();
// Abrir nuestra base de datos
var db = new sqlite3.Database(                  //db va a dar acceso a toda la base de datos
    'based.db', // nombre del fichero de base de datos
    function(err) { // funcion que será invocada con el resultado
    if (err) // Si ha ocurrido un error
     console.log(err); // Mostrarlo por la consola del servidor
     }
);




'use strict';
// Cargamos el modulo de Express
const express = require('express');


// Cargamos el modulo
const session = require('express-session');

// Creamos un objeto servidor HTTP, va a responder a las petiiciones HTTP
const server = express();

const tiempoCookie = 8*60*60*1000;
server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: tiempoCookie }
}))

// Definimos el puerto a usar por el servidor HTTP
//const port = 8080;


var path = require('path');
// Configuramos la ruta / en el servidor HTTP para que devuelva un saludo
server.get('/', function(req, res) {             //cuando hagan un get a esa ruta, se ejecita esa funcion, genera un objeto respuesta y se lo pasa a la funcion
    res.sendFile(path.join(__dirname, 'views/indice.html'))
    });


    server.get('/datauser', function(req, res) {             //cuando hagan un get a esa ruta, se ejecita esa funcion, genera un objeto respuesta y se lo pasa a la funcion
        res.sendFile(path.join(__dirname, 'views/infousuario.html'))
        });



// Obtener la referencia al módulo 'body-parser'
const bodyParser = require('body-parser');
//const res = require('express/lib/response');

// Configuring express to use body-parser as middle-ware.
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());



//si se hace l Obtener el configurador de rutas
const router = express.Router();
// Configurar la accion asociada al login

router.post('/respuestajson', function(req, res) {
// Comprobar si la petición contiene los campos ('user' y 'passwd')
   /* res.sendFile(path.join(__dirname, 'views', 'login.html')); */
   
    if (!req.body.user || !req.body.passwrd) {
        res.sendFile(path.join(__dirname, 'views/indice.html'));
        return;
    }
    // La petición está bien formada -> procesarla
    // TODO: procesar la peticón
    //processLogin(req, res, db);
    var login = req.body.user;
    var passwrd = req.body.passwrd;
    console.log(login);
    console.log(passwrd);

    db.each(
    // consulta y parámetros cuyo valor será usado en los '?'
    'SELECT * FROM users WHERE user=?', login,
    // funcion que se invocará con los datos obtenidos de la base de datos
    function(err, row) {
        if (row == undefined) {
            // La consulta no devuelve ningun dato -> no existe el usuario
            //res.json({ errormsg: 'El usuario no existe'});
            console.log("El usuario no existe");
            res.sendFile(path.join(__dirname, 'views/indice.html'));
        } else if (row.passwrd === passwrd) {
            // La contraseña es correcta
        

            // Asociar el userID a los datos de la sesión
            req.session.userId = row.id; // solo el id del usuario registrado
            console.log(req.session.userId);
            // Preparar los datos a enviar al navegador (AngularJS)
            var data = {
                id: row.id,
                name: row.user,
                passwrd: row.passwrd
            };
            // enviar en la respuesta serializado en formato JSON
            console.log(data);
            //res.json(data);
            res.sendFile(path.join(__dirname, 'views/infousuario.html'));
            
            
            
            
        } else {
            // La contraseña no es correcta -> enviar este otro mensaje
            //res.json({ errormsg: 'Fallo de autenticación'});
            console.log("Fallo de autenticación");
        }
        
    }
    
    );

    
    
});
 module.exports= server;

 router.get('/respuestajson', function(req, res) {
    // Comprobar si la petición contiene los campos ('user' y 'passwd')
       /* res.sendFile(path.join(__dirname, 'views', 'login.html')); */
        // La petición está bien formada -> procesarla
        // TODO: procesar la peticón
        //processLogin(req, res, db);
        var iduser = req.session.userId;
        console.log(iduser); 

        const sql = 'SELECT * FROM videos WHERE id_user=?';
        db.each(
        // consulta y parámetros cuyo valor será usado en los '?'
        sql, iduser,
        // funcion que se invocará con los datos obtenidos de la base de datos
        function(err, rows) {
            if (rows == undefined) {
                // La consulta no devuelve ningun dato -> no existe el usuario
                res.json({ errormsg: 'No hay videos que mostrar'});
            } else if (rows.id_user === iduser) {
                // La contraseña es correcta
                
                // Asociar el userID a los datos de la sesión
                req.session.userId = rows.id_user; // solo el id del usuario registrado
                console.log(req.session.userId);
                // Preparar los datos a enviar al navegador (AngularJS)
                /*var data = {
                    id: row.id,
                    title: row.title,
                    categoria: row.categoria
                };*/
                // enviar en la respuesta serializado en formato JSON
                console.log(sql);
                //console.log(data);
                //res.json(data);

            

               // res.render("views/prueba.html",{modelo:rows});
                
                
                
                
            } else {
                // La contraseña no es correcta -> enviar este otro mensaje
                res.json({ errormsg: 'Fallo de autenticación'});
            }
            
        }
        
        );
    

        
    });



//function processLogin(req, res, db){

//}

/*
// Configurar la accion asociada al listado de correos
router.get('/list', function (req, res) {
//TODO: verificar los parametros de la peticion
    if (verificarParametrosListar(req, db)) {
// TODO: procesar la petición
        processListar(req, res, db);
        return;
    }
    res.json({ errormsg: 'Peticion mal formada'});
});*/
/*
function verificarParametrosListar(req, db){
    var id = req.params.id;
    var login = req.params.login;
    var name = req.params.name;
    var email = req.params.email;
    console.log(id);
    console.log(login);
    console.log(name);
    console.log(email);


}*/

/*
// Configurar la accion asociada a la petición del contenido de un correo
router.get('/email/:email_id',function (req, res) {
//TODO: verificar los parametros de la peticion
if (verificarParametrosEmail(req, db)) {
// TODO: procesar la petición
 processEmail(req, res, db);
return;
 }
 res.json({ errormsg: 'Peticion mal formada'});
});*/


///////////////////////////////////////////////////////////////////////////////////////////
/*
// Obtener el configurador de rutas
const router = express.Router();
// Configurar la accion asociada al login
router.post('/loginPrueba', function(req, res) {
// Comprobar si la petición contiene los campos ('user' y 'passwd')
if (!req.body.user || !req.body.passwrd) {
 res.json({ errormsg: 'Peticion mal formada'});
return;
 }
// La petición está bien formada -> procesarla
// TODO: procesar la peticón
 //processLogin(req, res);
});
// Configurar la accion asociada al listado de correos
router.get('/list', function (req, res) {
//TODO: verificar los parametros de la peticion
if (verificarParametrosListar(req)) {
// TODO: procesar la petición
 processListar(req, res);
return;
 }
 res.json({ errormsg: 'Peticion mal formada'});
});
*/
/////////////////////////////////////////////////////////////////////////////////////////


// Añadir las rutas al servidor
server.use('/', router);

//la funcionalidad con el router es capaz de extraernos parametros

// Añadir las rutas estáticas al servidor.
server.use(express.static('public'));       //carpeta dentro de email-app




// Poner en marcha el servidor
server.listen(4044, function()  {
    console.log('Servidor corriendo en el puerto 4044');
});