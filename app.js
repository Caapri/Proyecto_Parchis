var mongo = require(__dirname + '/views/js/mongodb.js');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);

app.use('/css', express.static(__dirname + '/views/css'));
app.use('/js', express.static(__dirname + '/views/js'));
app.use('/img', express.static(__dirname + '/views/img'));
app.use('/', express.static(__dirname + '/views'));

// REDIRECCIONES
app.get('/', function(req, res) { // REDIRECCIÓN A RAÍZ
    res.sendFile( __dirname + '/views/index.html');
});

app.get('/login', function(req, res) { // REDIRECCIÓN A LOGIN
    var nombre = req.query.nombre;
    var pass = req.query.pass;
    //res.send(nombre);
    res.sendFile( __dirname + '/views/login.html');
});

app.get('/signup', function(req, res) { // REDIRECCIÓN A REGISTRO
    res.sendFile( __dirname + '/views/signup.html');
});

app.get('/profile', function(req, res) { // REGISTRO DE USUARIO RECIBIENDO AJAX
    mongo.insertarMongo(req.query.usuario, req.query.correo, req.query.pass).then(function(insertar) {
        //console.log('Insertado: ' + insertar);
        res.send(insertar);
    });
});

app.get('/entrar', function(req, res) { // LOGIN DE USUARIO RECIBIENDO AJAX
    mongo.login(req.query.nombre, req.query.pass).then(function(resultado) {
        res.send(resultado);
    });
});

app.get('/datosUsuario', function(req, res) { // LOGIN DE USUARIO RECIBIENDO AJAX
    mongo.recuperarDatos(req.query.nombre).then(function(resultado) {
        res.send(resultado);
    });
});

app.get('/salir', function(req, res) { // CERRAR SESIÓN
    res.sendFile( __dirname + '/views/cerrarSesion.html');
});

app.get('/perfil', function(req, res) { // PERFIL DEL USUARIO
    res.sendFile( __dirname + '/views/perfil.html');
});
  
app.post('/jugar', function (req, res) { // JUGAR AL PARCHÍS (TABLERO)
    /*var directorio = __dirname;
    directorio = directorio.substr(0, 55) + '/public/parchis.html';
    res.sendFile(directorio);*/
    res.sendFile( __dirname + '/views/parchis.html');
});

app.get('/salas', function (req, res) { // SALAS
    /*var directorio = __dirname;
    directorio = directorio.substr(0, 55) + '/public/salas.html';
    res.sendFile(directorio);*/
    //res.sendFile( __dirname +  '/public/salas.html');
    res.sendFile( __dirname + '/views/salas.html');
});

// Conexión de un nuevo socket
io.on('connection', function(socket) {
    console.log('Nuevo usuario conectado');
});

// Puerto de escucha del servidor
http.listen(3030, function() {
    console.log('Escuchando en el puerto 3030');
});

//////////////////////////


var mensajes = [{ id: 1, texto: "Bienvenido a la Sala", author: "Server" }];
//var mensajes;
var mensajesSala1 = [{ texto: "Bienvenido a la Sala 1", author: "Server" }],
  mensajesSala2 = [{ texto: "Bienvenido a la Sala 2", author: "Server" }],
  mensajesSala3 = [{ texto: "Bienvenido a la Sala 3", author: "Server" }],
  mensajesSala4 = [{ texto: "Bienvenido a la Sala 4", author: "Server" }];

var salasuser = {};

// azul: #3831eb      rojo: #a11f1f  
// amarillo: #e8c45e  verde: #188300
var contadoresSalas = new Map();
contadoresSalas.set("Sala1", 0);
contadoresSalas.set("Sala2", 0);
contadoresSalas.set("Sala3", 0);
contadoresSalas.set("Sala4", 0);

var participantesSala1 = new Map(),
  participantesSala2 = new Map(),
  participantesSala3 = new Map(),
  participantesSala4 = new Map();

var turno = Math.round(Math.random());
participantesSala1.set('#3831eb', "").set('#188300', "").set('turno', turno);
turno = Math.round(Math.random());
participantesSala2.set('#3831eb', "").set('#188300', "").set('turno', turno);
turno = Math.round(Math.random());
participantesSala3.set('#3831eb', "").set('#188300', "").set('turno', turno);
turno = Math.round(Math.random());
participantesSala4.set('#3831eb', "").set('#188300', "").set('turno', turno);

var salaactual;
var salas = ["Sala1", "Sala2", "Sala3", "Sala4"];

//app.use(express.static('public'));

io.on('connection', function (socket) {
  console.log("Alguien se ha conectado con socket");
  socket.emit('messages', mensajes);

  socket.emit("salas", salas);

  socket.on("room", function (sala) {
    var contador = contadoresSalas.get(sala);
    if (contador >= 2) {
      io.sockets.to(socket.id).emit("salallena");
      io.sockets.emit("deshabilitarboton", sala);
    } else {
      socket.join(sala);

      salasuser[socket.id] = sala;
      //console.log(salasuser);
      var entedesala;
      if (sala == "Sala1") {
        var keys = Array.from(participantesSala1.keys());
        console.log("--ides de la sala: " + keys);
        var cont = contadoresSalas.get('Sala1');
        console.log("---personas en la sala: " + cont);
        participantesSala1.set(keys[cont], socket.id);
        console.log("----añade persona a la sala: ");
        console.log(participantesSala1);
        cont++;
        console.log("-----suma 1 al contador: " + cont);
        contadoresSalas.set('Sala1', cont);
        console.log("-------valor de la sala: ");
        console.log(contadoresSalas);
        gentedesala = participantesSala1;
      }
      if (sala == "Sala2") {
        var keys = Array.from(participantesSala2.keys());
        console.log("--ides de la sala: " + keys);
        var cont = contadoresSalas.get('Sala2');
        console.log("---personas en la sala: " + cont);
        participantesSala2.set(keys[cont], socket.id);
        console.log("----añade persona a la sala: ");
        console.log(participantesSala2);
        cont++;
        console.log("-----suma 1 al contador: " + cont);
        contadoresSalas.set('Sala2', cont);
        console.log("-------valor de la sala: ");
        console.log(contadoresSalas);
        gentedesala = participantesSala2;
      }
      if (sala == "Sala3") {
        var keys = Array.from(participantesSala3.keys());
        console.log("--ides de la sala: " + keys);
        var cont = contadoresSalas.get('Sala3');
        console.log("---personas en la sala: " + cont);
        participantesSala3.set(keys[cont], socket.id);
        console.log("----añade persona a la sala: ");
        console.log(participantesSala3);
        cont++;
        console.log("-----suma 1 al contador: " + cont);
        contadoresSalas.set('Sala3', cont);
        console.log("-------valor de la sala: ");
        console.log(contadoresSalas);
        gentedesala = participantesSala3;
      }
      if (sala == "Sala4") {
        var keys = Array.from(participantesSala4.keys());
        console.log("--ides de la sala: " + keys);
        var cont = contadoresSalas.get('Sala4');
        console.log("---personas en la sala: " + cont);
        participantesSala4.set(keys[cont], socket.id);
        console.log("----añade persona a la sala: ");
        console.log(participantesSala4);
        cont++;
        console.log("-----suma 1 al contador: " + cont);
        contadoresSalas.set('Sala4', cont);
        console.log("-------valor de la sala: ");
        console.log(contadoresSalas);
        gentedesala = participantesSala4;
      }
      console.log("Se ha conectado a la sala " + sala + "");

      //'#3831eb', ""     '#188300', ""     'turno', turno
      var gente = { '#3831eb': gentedesala.get('#3831eb'), '#188300': gentedesala.get('#188300'), "turno": gentedesala.get('turno') }
      console.log(gente);
      io.sockets.in(sala).emit("genteensala", gente);
    }
  });

  socket.on("new-message", function (comentarios) {
    if (getRoom(socket) == "Sala1") mensajes = mensajesSala1;
    if (getRoom(socket) == "Sala2") mensajes = mensajesSala2;
    if (getRoom(socket) == "Sala3") mensajes = mensajesSala3;
    if (getRoom(socket) == "Sala4") mensajes = mensajesSala4;

    mensajes.push(comentarios);
    console.log("envio los mensajes del server");
    io.sockets.in(getRoom(socket)).emit('messages', mensajes);
    //io.sockets.emit("messages", mensajes);
  });

  socket.on("dados", function (dados) {
    console.log(dados[0], dados[1]);
    io.sockets.in(getRoom(socket)).emit("actualizartitulo", dados, getRoom(socket));
  });

  socket.on("cambiarturno", function (turnos2) {
    var actualizarturno;
    if (getRoom(socket) == "Sala1") participantesSala1.set("turno", turnos2), actualizarturno = participantesSala1;
    if (getRoom(socket) == "Sala2") participantesSala2.set("turno", turnos2), actualizarturno = participantesSala2;
    if (getRoom(socket) == "Sala3") participantesSala3.set("turno", turnos2), actualizarturno = participantesSala3;
    if (getRoom(socket) == "Sala4") participantesSala4.set("turno", turnos2), actualizarturno = participantesSala4;

    var actualizarturno2 = { '#3831eb': actualizarturno.get('#3831eb'), '#188300': actualizarturno.get('#188300'), "turno": actualizarturno.get('turno') };

    io.sockets.in(getRoom(socket)).emit("genteensala", actualizarturno2);
  });

  socket.on("rgbTohx", function (color) {
    var hx = "#" + rgbHex(color);
    socket.emit("resrgbTohx", hx);
  });

  socket.on("conectado", function () {
    socket.broadcast.emit("hola");
  });

  socket.on("movimiento", function (fichasamover) {
    console.log("He recivido un movimiento");
    //io.sockets.emit("muevoficha", fichasamover);
    io.sockets.in(getRoom(socket)).emit("muevoficha", fichasamover);
  });

  socket.on('disconnect', function () {
    console.log(salasuser);
    var usersal = salasuser[socket.id];
    console.log("--sala del socket(usersal): " + usersal);
    var cont = contadoresSalas.get(usersal);
    console.log("---personas en la sala: " + cont);
    cont--;
    console.log("-----resta 1 al contador: " + cont);
    contadoresSalas.set(usersal, cont);
    console.log("-------valor de la sala: ");
    console.log(contadoresSalas);

    delete salasuser[socket.id];
    var keysalas;
    if (usersal == "Sala1") {
      keysalas = Array.from(participantesSala1.keys());
      for (let key of keysalas) {
        if (participantesSala1.get(key) == socket.id) participantesSala1.set(key, "");
      }
      console.log(participantesSala1);
    }
    if (usersal == "Sala2") {
      keysalas = Array.from(participantesSala2.keys());
      for (let key of keysalas) {
        if (participantesSala2.get(key) == socket.id) participantesSala2.set(key, "");
      }
      console.log(participantesSala2);
    }
    if (usersal == "Sala3") {
      keysalas = Array.from(participantesSala3.keys());
      for (let key of keysalas) {
        if (participantesSala3.get(key) == socket.id) participantesSala3.set(key, "");
      }
      console.log(participantesSala3);
    }
    if (usersal == "Sala4") {
      keysalas = Array.from(participantesSala4.keys());
      for (let key of keysalas) {
        if (participantesSala4.get(key) == socket.id) participantesSala4.set(key, "");
      }
      console.log(participantesSala4);
    }

    io.sockets.to(socket.id).emit("borrarsala");

    console.log(keysalas);
    console.log("Se ha desconectado");

    var contador = contadoresSalas.get(usersal);
    if (contador < 2) {
      io.sockets.emit("habilitarboton", usersal);
    }
  });

});

/*server.listen(9090, function () {
  console.log("Servidor iniciado por el pueto http://localhost:9090");
});*/

function getRoom(socket) {
  var count = 0;
  var identifi = socket.id;
  var rooms = socket.adapter.sids[identifi];
  for (var room in rooms) {
    //console.log(room);
    if (count == 1) return room;
    count++;
  }
}

///////////////////////////







