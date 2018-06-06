/* CLIENTE */

var socket = io.connect();

// Incustacion de los dados aleatorios en el titulo
socket.on("actualizartitulo", function (dados) {
  var dice = d3.selectAll("#dice");
  dice.remove();

  var dice2 = d3.selectAll("#dice2");
  dice2.remove();

  dados3drival(dados);
});

socket.on("borrarsala", function () {
  //console.log(sessionStorage.getItem("sala"));
  sessionStorage.removeItem("sala");
  //console.log(sessionStorage.getItem("sala"));
});

// Decirle al cliente que la sala está llena y redirigirlo a las salas
socket.on("salallena", function () {
  alert("La sala esta llena");
  location.href = "/";
});

// mensaje de alerta de cuando se conecta un usuario a la partida
socket.emit('conectado');

/*var submitChat = document.getElementById("enviarChat");
var mensajeChat = document.getElementById("inputChat");
console.log("Console log mensajeChat value: " + mensajeChat);
submitChat.addEventListener("click", function() {
  socket.emit("chat message", mensajeChat);
});*/

/*var enviarChat = document.getElementById("enviarChat");
enviarChat.addEventListener("click", mensajeChat(e));
console.log("holiiis: " + enviarChat);*/

// CHAT
function mensajeChat(e) {
  var usuario = sessionStorage.getItem("user");
  var mensaje = {
    autor: usuario,
    mensaje: document.getElementById("inputChat").value
  }

  socket.emit("chat_mensajes", mensaje);
  return false;
}

socket.on("envioMsgCliente", function (msg) {
  //console.log("Entrando al envio de mensajes en el cliente");
  var nick = msg.autor,
    texto = msg.mensaje;

  var ul = document.getElementById("messages");

  // Creación del li nuevo
  var li = document.createElement("li");
  var listaMensajes = document.createTextNode(nick + ": " + texto);
  li.appendChild(listaMensajes);
  li.setAttribute("class", "msgChat");
  ul.appendChild(li);
});


//////////////////////////////

var daditos = 0;

// carga de las funciones del js
window.onload = function () {
  var svg = d3.select(document.getElementById("parchis").contentDocument);
  var puentes = [],
    fichasamover = [],
    opciones = [],
    turnos,
    fichasini,
    metasini,
    dados, dado1, dado2, dadosum, dadosum2,
    mov1, mov2, mov3,
    participantes = new Map(),
    cas = new RegExp(/fill:#([a-f0-9]+)/),
    sala,
    contcasas = 4,
    fichascasas = 1,
    fichasmetas = 1,
    contdados = 0,
    todosumacinco = 1;


  // Recoger el nombre de la sala del sessionStorage
  salatual = sessionStorage.getItem("sala");

  // Poner el nombre de la sala en la cabecera de la página de juego
  var tituloSala = document.getElementById("tituloSala");
  tituloSala.innerHTML = salatual;

  // Poner el nombre de usuario en la cabecera de la página del juego
  var nick = sessionStorage.getItem("user");
  var userPlay = document.getElementById("userPlay");
  userPlay.innerHTML = nick;

  var lanzar_dados = document.getElementById('boton');

  //console.log('elemnto hijo: ', document.getElementById("msgChat").lastElementChild);

  // union a la sala que quiere unirse
  socket.emit("room", salatual);

  var sala;

  // Mensaje de bienvenido/a a la sala 
  var bienvenida = d3.select('#messages');
  bienvenida.append("li")
    .attr("class", "welcomeChat")
    .html("Bienvenido/a a la sala " + salatual);
  bienvenida.append("br");

  /*
  var welcomeChat = d3.select(".welcomeChat");
  welcomeChat.append("li");*/

  /* Confirmación de salir de la partida (Función global reutilizable para mostrar un confirm) */
  function confirmar(string) {
    /*if(!confirm(string)) {
      return false;
    } else {
      location.href = "/"; // Redireccionar a la página principal
    }*/

  }

  // funcion para generar los dados  

  socket.on("genteensala", function (gentedesala, fichasiniciales, metasiniciales) {
    participantes = gentedesala;

    //console.log("gente que hay en sala, color y turno");
    //'#3831eb', ""     '#188300', ""     'turno', 0/1
    console.log(participantes);

    var socketcolores = Object.values(participantes),
      socketcoloreskeys = Object.keys(participantes),
      turnos = participantes.turno,
      tusocket = socket.id,
      colorparticipante = [];

    if (fichascasas == 1) fichascasas = fichasiniciales;
    if (fichasmetas == 1) fichasmetas = metasiniciales;
    if (turnos == 0) colorparticipante = socketcolores[0], colorpersona = socketcoloreskeys[0], fichasini = fichascasas[0], fichasalida = "ficha56-2", metasini = fichasmetas[0];
    else colorparticipante = socketcolores[1], colorpersona = socketcoloreskeys[1], fichasini = fichascasas[1], fichasalida = "ficha22-2", metasini = fichasmetas[1];

    console.log("fichas iniciales:");
    console.log(fichasini);
    console.log("fichas metas:");
    console.log(metasini);

    console.log("Tu color es: " + colorpersona);
    console.log("Turno del color ---------------- tu color");
    console.log(colorparticipante + " - " + tusocket);
    if (colorpersona == "#3831eb") d3.select("#tucolor").html("Turno de las azules");
    if (colorpersona == "#188300") d3.select("#tucolor").html("Turno de las verdes");

    if (colorparticipante == tusocket) {
      tirada(turnos);
    } else {
      alert("turno del rival");
    }

  });

  function tirada(turnos) {
    // variable que coge el svg del parchis
    var svg = d3.select(document.getElementById("parchis").contentDocument);
    var toca = turnos;

    lanzar_dados.addEventListener("click", lanzardados);

    function lanzardados() {
      var caca = dados3d();
      contdados = 0;
      dados = Array(caca[0], caca[1]);
      socket.emit("dados", dados);
      dado1 = dados[0], dado2 = dados[1], dadosum = dado1 + dado2;
      dado11 = dados[0], dado22 = dados[1], dadosum2 = dado1 + dado2;

      console.log("somos los dados!!!!");
      console.log("dado1: " + dado1 + " dado2: " + dado2 + " sumadados: " + dadosum + " contadordados: " + contdados);
      if (dado1 == 5 || dado2 == 5 || dadosum == 5) {
        if (contcasas > 0) {
          console.log("ha salido un 5");

          if (dado1 == 5) {
            contdados += 5;
            dado1 = 0;
            dadosum -= 5;
            console.log("El primer dado vale 5");
            sacarcasa();
          }
          if (dado2 == 5) {
            contdados += 5;
            dado2 = 0;
            dadosum -= 5;
            console.log("El segundo dado vale 5");
            sacarcasa();
          }
          if (dadosum == 5) {
            contdados = dadosum2;
            dado1 = 0;
            dado2 = 0;
            dadosum = 0;
            console.log("la suma de los dados vale 5");
            sacarcasa();
          }

          function sacarcasa() {
            var fichaasacar;
            for (let ficha in fichasini) {
              //console.log("ficha: " + ficha);
              //console.log(fichasini[ficha]);
              if (fichasini[ficha] == 1) {
                //console.log("esta es la ficha a sacar: " + ficha);
                fichaasacar = ficha;
                fichasini[ficha] = 0;
                contcasas--;
                //console.log("array de las casas:");
                //console.log(fichasini);
                //console.log("contador de casas: " + contcasas);
                break;
              }
            }
            console.log("somos los dados despues del 5!!!!");
            console.log("dado1: " + dado1 + " dado2: " + dado2 + " sumadados: " + dadosum + " contadordados: " + contdados);


            colorcasa = sacarcolor("#" + fichasalida);

            dados51 = { "id": fichaasacar, "fill": colorpersona };
            dados52 = { "id": fichasalida, "fill": colorcasa };

            var dados5 = [];
            dados5.push(dados51);
            dados5.push(dados52);

            socket.emit("movimiento", dados5);
          }

        }
      }
    }

    // inicializacion de la variable que contendra los puentes y los movimientos de las fichas
    var puentes = [];
    var fichasamover = [];
    var opciones = [];
    var cas = new RegExp(/fill:#([a-f0-9]+)/);
    var r = new RegExp(/fill:#([a-f0-9]+)/);
    var r1 = new RegExp(/opacity:(0|1)+/);

    svg
      .selectAll('*[id^="ficha"]')   // selecciona todos los elementos que empiezen por el id ficha
      .on("mouseover", colorearcasillas) // funcion para iluminar casillas donde puedes poner las fichas
      .on("click", seleccionarfichas) //funcion para seleccionar fichas
      .on("mouseout", descolorearcasillas);


    function seleccionarfichas() {

      if (typeof dados != "undefined") {
        // variable para el id de las fichas
        var id = d3.select(this).attr("id");

        // generar array para pas fichas a mover
        if (fichasamover.length != 2) {
          var relleno = rgb2hex(this.style.fill);

          // condicion si el array ya tiene una ficha
          if (fichasamover.length == 1) {
            //console.log("la id es: " + id);
            var idrecortada = id.substr(0, id.length - 2);
            //console.log("la id recortada es: " + idrecortada);
            if (idrecortada == mov1 || idrecortada == mov2 || idrecortada == mov3) {
              if (idrecortada == mov1) contdados += dado11, dadosum -= dado1, dado1 = 0;
              if (idrecortada == mov2) contdados += dado22, dadosum -= dado2, dado2 = 0;
              if (idrecortada == mov3) contdados += dadosum2, dadosum = 0;

              var fichapuente3 = "#" + id.substr(0, id.length - 1) + "3";
              var fichapuente2 = "#" + id.substr(0, id.length - 1) + "2";
              var fichapuente1 = "#" + id.substr(0, id.length - 1) + "1";
              console.log("La segunda ficha no es la del medio");

              var color1 = sacarcolor(fichapuente3);
              var color2 = sacarcolor(fichapuente2);
              var color3 = sacarcolor(fichapuente1);
              //console.log(color1);

              var ficha2 = new Object();
              ficha2.id = id;
              ficha2.fill = relleno;
              fichasamover.push(ficha2);
              //console.log(fichasamover);
            } else {
              console.log("No puedes mover la ficha a esa posición");
            }
          } else {
            // control de la posicion donde la quieres poner
            if (relleno != "#ffffff") { // si no es blanca
              if (relleno == colorpersona) {
                var ficha1 = new Object();
                ficha1.id = id;
                ficha1.fill = relleno;
                fichasamover.push(ficha1);
              } else {
                console.log("No intentes mover una ficha que no es tuya!!!");
              }
            } else {
              console.log("la ficha es blanca");
            }
          }
        }

        // hacer el movimiento cuando ya has seleccionado 2 fichas
        if (fichasamover.length == 2 || (dado1 == 0 && dado2 == 0 && dadosum == 0)) {//salatual
          socket.emit("movimiento", fichasamover);
          fichasamover = [];
          console.log("contador de dados = " + contdados);
          console.log("suma de dados = " + dadosum2);
          //if (Math.round(contdados / 2) == dadosum2 || todosumacinco == 0) {
          if (contdados == dadosum2 || (dado1 == 0 && dado2 == 0 && dadosum == 0)) {
            if (toca == 0) toca = 1;
            else toca = 0;
            dado1 = 0, dado2 = 0, dadosum = 0;
            dado11 = 0, dado22 = 0, dadosum2 = 0;
            socket.emit("cambiarturno", toca);
            contdados = 0;

            svg
              .selectAll('*[id^="ficha"]')   // selecciona todos los elementos que empiezen por el id ficha
              .on("mouseover", function () { }) // funcion para iluminar casillas donde puedes poner las fichas
              .on("click", function () { }) //funcion para seleccionar fichas
              .on("mouseout", function () { });
            lanzar_dados.removeEventListener("click", lanzardados);

          } else {
            console.log("sigue moviendo");
          }
        }
      }
    }

    function colorearcasillas() {
      if (typeof dados != "undefined") {
        var meta = 0;
        //console.log("entro en colorear ficha");
        var idficha = d3.select(this).attr("id");
        idficha = "#" + idficha;

        var colorfich = sacarcolor(idficha);

        if (colorfich != "#ffffff") {
          var num = idficha.charAt(6) + idficha.charAt(7);
          //console.log(num);

          var idfichameta = idficha.substr(0, idficha.length - 4);
          console.log("ficha meta: " + idfichameta);

          if (idfichameta == "#fichaMetaAzul") {
            num = idficha.charAt(14) + idficha.charAt(15);
            console.log("si es casilla de meta azul: " + num);
            meta = 1;
          }
          if (idfichameta == "#fichaMetaVerde") {
            num = idficha.charAt(15) + idficha.charAt(16);
            console.log("si es casilla de meta verde: " + num);
            meta = 1;
          }

          if (isNaN(num)) {
            //num = idficha.charAt(10) + idficha.charAt(11);
            console.log("no puedes pover esa ficha");
          } else {
            //console.log(num);

            var mouse = d3.select(this).attr("id");

            var numero = parseInt(num);

            var temp1 = numero + dado1,
              temp2 = numero + dado2,
              temp3 = numero + dadosum;

            if (temp1 > 68) temp1 = temp1 - 68;
            if (temp2 > 68) temp2 = temp2 - 68;
            if (temp3 > 68) temp3 = temp3 - 68;

            if (temp1 < 10) temp1 = "0" + temp1;
            if (temp2 < 10) temp2 = "0" + temp2;
            if (temp3 < 10) temp3 = "0" + temp3;

            var opcion1, opcion2, opcion3;
            console.log("color de la ficha: " + colorfich);
            //fichaMetaVerde01-2  fichaMetaAzul01-2
            if (colorfich == "#3831eb") {
              console.log("valor de los dados a resaltar: " + temp1 + " " + temp2 + " " + temp3 + " color azul");

              if (temp1 > 51 && temp1 < 56) {
                console.log("la ficha azul se va la meta - 1");
                temp1 = "0" + (temp1 - 51);
                opcion1 = "#metaAzul" + temp1;
                mov1 = "fichaMetaAzul" + temp1;
              } else {
                if (meta == 1) {
                  if (temp1 > 7) {
                    console.log("ten cuidadol!!");
                    opcion1 = "#casilla" + temp1;
                    mov1 = "ficha" + temp1;
                  } else {
                    opcion1 = "#metaAzul" + temp1;
                    mov1 = "fichaMetaAzul" + temp1;
                  }
                } else {
                  opcion1 = "#casilla" + temp1;
                  mov1 = "ficha" + temp1;
                }
              }
              if (temp2 > 51 && temp2 < 56) {
                console.log("la ficha azul se va la meta - 2");
                temp2 = "0" + (temp2 - 51);
                opcion2 = "#metaAzul" + temp2;
                mov2 = "fichaMetaAzul" + temp2;
              } else {
                if (meta == 1) {
                  if (temp2 > 7) {
                    console.log("ten cuidadol!!");
                    opcion2 = "#casilla" + temp2;
                    mov2 = "ficha" + temp2;
                  } else {
                    opcion2 = "#metaAzul" + temp2;
                    mov2 = "fichaMetaAzul" + temp2;
                  }
                } else {
                  opcion2 = "#casilla" + temp2;
                  mov2 = "ficha" + temp2;
                }
              }
              if (temp3 > 51 && temp3 < 56) {
                temp3 = "0" + (temp3 - 51);
                console.log("la ficha azul se va la meta - 2");
                opcion3 = "#metaAzul" + temp3;
                mov3 = "fichaMetaAzul" + temp3;
              } else {
                if (meta == 1) {
                  if (temp3 > 7) {
                    console.log("ten cuidadol!!");
                    opcion3 = "#casilla" + temp3;
                    mov3 = "ficha" + temp3
                  } else {
                    opcion3 = "#metaAzul" + temp3;
                    mov3 = "fichaMetaAzul" + temp3;
                  }
                } else {
                  opcion3 = "#casilla" + temp3;
                  mov3 = "ficha" + temp3;
                }
              }
            }

            if (colorfich == "#188300") {
              console.log("valor de los dados a resaltar: " + temp1 + " " + temp2 + " " + temp3 + " color verde");
              if (temp1 > 17 && temp1 < 22) {
                temp1 = "0" + (temp1 - 17);
                console.log("la ficha Verde se va la meta - 1");
                opcion1 = "#metaVerde" + temp1;
                mov1 = "fichaMetaVerde" + temp1;
              } else {
                if (meta == 1) {
                  if (temp1 > 7) {
                    console.log("ten cuidadol!!");
                    opcion1 = "#casilla" + temp1;
                    mov1 = "ficha" + temp1;
                  } else {
                    opcion1 = "#metaVerde" + temp1;
                    mov1 = "fichaMetaVerde" + temp1;
                  }
                } else {
                  opcion1 = "#casilla" + temp1;
                  mov1 = "ficha" + temp1;
                }
              }
              if (temp2 > 17 && temp2 < 22) {
                temp2 = "0" + (temp2 - 17);
                console.log("la ficha Verde se va la meta - 2");
                opcion2 = "#metaVerde" + temp2;
                mov2 = "fichaMetaVerde" + temp2;
              } else {
                if (meta == 1) {
                  if (temp2 > 7) {
                    console.log("ten cuidadol!!");
                    opcion2 = "#casilla" + temp2;
                    mov2 = "ficha" + temp2;
                  } else {
                    opcion2 = "#metaVerde" + temp2;
                    mov2 = "fichaMetaVerde" + temp2;
                  }
                } else {
                  opcion2 = "#casilla" + temp2;
                  mov2 = "ficha" + temp2;
                }
              }
              if (temp3 > 17 && temp3 < 22) {
                temp3 = "0" + (temp3 - 17);
                console.log("la ficha Verde se va la meta - 2");
                opcion3 = "#metaVerde" + temp3;
                mov3 = "fichaMetaVerde" + temp3;
              } else {
                if (meta == 1) {
                  if (temp3 > 7) {
                    console.log("ten cuidadol!!");
                    opcion3 = "#casilla" + temp3;
                    mov3 = "ficha" + temp3;
                  } else {
                    opcion3 = "#metaVerde" + temp3;
                    mov3 = "fichaMetaVerde" + temp3;
                  }
                } else {
                  opcion3 = "#casilla" + temp3;
                  mov3 = "ficha" + temp3;
                }
              }
            }

            if (dado1 != 0) opciones.push(opcion1);
            if (dado2 != 0) opciones.push(opcion2);
            if (dadosum != 0) opciones.push(opcion3);

            for (var elementos of opciones) {
              var casilla = svg.select(elementos).attr('style');
              var casillacolor = casilla.replace(cas, "fill:#00ccff");
              svg.select(elementos).attr('style', casillacolor);
            }
          }
        }
      }
    }

    function descolorearcasillas() {
      var defec = "fill:#ffffff";
      for (var elementos of opciones) {
        var ponercolor = svg.select(elementos).attr('style');

        if (elementos == "#casilla05") defec = "fill:#ff0000";
        if (elementos == "#casilla68") defec = "fill:#ff0000";
        if (elementos == "#casilla17") defec = "fill:#188300";
        if (elementos == "#casilla22") defec = "fill:#188300";
        if (elementos == "#casilla34") defec = "fill:#f6ff4b";
        if (elementos == "#casilla39") defec = "fill:#f6ff4b";
        if (elementos == "#casilla51") defec = "fill:#3831eb";
        if (elementos == "#casilla56") defec = "fill:#3831eb";

        var ponercolorsus = ponercolor.replace(cas, defec);
        svg.select(elementos).attr('style', ponercolorsus);
      }
      opciones = [];
    }

    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

    function rgb2hex(orig) {
      var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
      return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
    }

  }

  socket.on("muevoficha", function (fichas) {
    moverfichas(fichas);
  });

  function moverfichas(fichas) {
    var svg = d3.select(document.getElementById("parchis").contentDocument);
    var r = new RegExp(/fill:#([a-f0-9]+)/);
    var r1 = new RegExp(/opacity:(0|1)+/);

    var idficha1 = "#" + fichas[0].id;
    var colorficha1 = "fill:" + fichas[0].fill;
    var idficha2 = "#" + fichas[1].id;
    var colorficha2 = "fill:" + fichas[1].fill;

    var pos3 = idficha1.substr(0, idficha1.length - 1) + "3";
    var pos2 = idficha1.substr(0, idficha1.length - 1) + "2";
    var pos1 = idficha1.substr(0, idficha1.length - 1) + "1";

    if (idficha1 == idficha2) {
      alert("No puedes poner la ficha en el mismo sitio!!!\nTonto!");
    } else if (idficha2 == pos3 || idficha2 == pos2 || idficha2 == pos1) {
      alert("Que pretendes?\nDuplicarte?");
    } else {
      var idfichacompare = idficha1.charAt(idficha1.length - 1);
      var idfichasalida = idficha1.substr(0, idficha1.length - 1);
      //console.log("ficha1: " + idfichasalida);
      if (idfichacompare != 2) {
        if (idfichasalida == "#fichaAzul0" || idfichasalida == "#fichaVerd0" || idfichasalida == "#fichaAmar0" || idfichasalida == "#fichaRoja0") {
          //console.log("ficha de salida");
          //console.log(idfichacompare);
          if (fichas[0].fill == fichas[1].fill) {
            bridgemake(pos3, pos2, pos1, colorficha1);
          }
        } else {
          pos3 = idficha1.substr(0, idficha1.length - 1) + "3";
          pos2 = idficha1.substr(0, idficha1.length - 1) + "2";
          pos1 = idficha1.substr(0, idficha1.length - 1) + "1";
          //console.log("quiero romper puente");
          bridgebreak(pos3, pos2, pos1, colorficha1);
        }
      }
      var idfichacompare2 = idficha2.charAt(idficha2.length - 1);
      if (idfichacompare2 != 2) {
        pos33 = idficha2.substr(0, idficha2.length - 1) + "3";
        pos22 = idficha2.substr(0, idficha2.length - 1) + "2";
        pos11 = idficha2.substr(0, idficha2.length - 1) + "1";
        console.log("La segunda ficha no es la del medio");

        var color1 = sacarcolor(pos11);
        var color2 = sacarcolor(pos22);
        var color3 = sacarcolor(pos33);

        if (color2 == "#ffffff") { // si es blanca
          //console.log("La posición del medio está libre");
          idficha2 = pos22;
        } else if (color1 == fichas[0].fill && color3 == fichas[0].fill) {
          //console.log("hay un puente y no puedes mover");
          alert("hay un puente, imposible mover");
          idficha2 = idficha1;
        } else if (color2 == fichas[0].fill) {
          //console.log("la ficha 2 es del mismo color que la primera");
          bridgemake(pos33, pos22, pos11, colorficha1);
        }
      } else {
        if (fichas[0].fill == fichas[1].fill) {
          pos33 = idficha2.substr(0, idficha2.length - 1) + "3";
          pos22 = idficha2.substr(0, idficha2.length - 1) + "2";
          pos11 = idficha2.substr(0, idficha2.length - 1) + "1";
          //console.log("la ficha 2 es del mismo color que la primera");
          bridgemake(pos33, pos22, pos11, colorficha1);
        }
      }

      //console.log(puentes);

      // tratamiento de la primera ficha
      var f1 = svg.select(idficha1).attr('style');
      var newStyle = f1.replace(r, colorficha2);
      newStyle = newStyle.replace(r1, "opacity:0");
      svg.select(idficha1).attr('style', newStyle);

      // tratamiento de la segunda ficha
      var f2 = svg.select(idficha2).attr('style');
      var newStyle1 = f2.replace(r, colorficha1);
      newStyle1 = newStyle1.replace(r1, "opacity:1");
      svg.select(idficha2).attr('style', newStyle1);
      var f2 = svg.select(idficha2).attr('style');

      /* // esto es para cuando se rompa el puente borrarlo del array de objetos de puentes
      for(var element in puentes){
        var temp = puentes[element];
        var content = Object.values(temp);
        console.log(content);
        if(content.includes(idficha1)){
          console.log("esta");
        }
      }*/

    }
  }

  function sacarcolor(posi) {
    var ficha = svg.select(posi);
    var ocupada = ficha.attr('style');
    var color = "";
    for (var i = 30; i < 37; i++) {
      color += ocupada.charAt(i);
    }
    return color;
  }

  function bridgebreak(posicion3, posicion2, posicion1, colorficha1) {
    var r = new RegExp(/fill:#([a-f0-9]+)/);
    var r1 = new RegExp(/opacity:(0|1)+/);
    console.log("Rompo el puente!");
    var arriba = svg.select(posicion3).attr('style');
    var arribablanca = arriba.replace(r, "fill:#ffffff");
    var arribablancaopaca = arribablanca.replace(r1, "opacity:0");
    svg.select(posicion3).attr('style', arribablancaopaca);

    var medio = svg.select(posicion2).attr('style');
    var medioblanca = medio.replace(r, colorficha1);
    var medioblancaopaca = medioblanca.replace(r1, "opacity:1");
    svg.select(posicion2).attr('style', medioblancaopaca);

    var abajo = svg.select(posicion1).attr('style');
    var abajoblanca = abajo.replace(r, "fill:#ffffff");
    var abajoblancaopaca = abajoblanca.replace(r1, "opacity:0");
    svg.select(posicion1).attr('style', abajoblancaopaca);
  }

  function bridgemake(posicion3, posicion2, posicion1, colorficha1) {
    var r = new RegExp(/fill:#([a-f0-9]+)/);
    var r1 = new RegExp(/opacity:(0|1)+/);
    console.log("Pongo un puente!");
    var arriba = svg.select(posicion3).attr('style');
    var arribablanca = arriba.replace(r, colorficha1);
    var arribablancaopaca = arribablanca.replace(r1, "opacity:1");
    svg.select(posicion3).attr('style', arribablancaopaca);

    var medio = svg.select(posicion2).attr('style');
    var medioblanca = medio.replace(r, "fill:#f7f2f2");
    var medioblancaopaca = medioblanca.replace(r1, "opacity:0");
    svg.select(posicion2).attr('style', medioblancaopaca);

    var abajo = svg.select(posicion1).attr('style');
    var abajoblanca = abajo.replace(r, colorficha1);
    var abajoblancaopaca = abajoblanca.replace(r1, "opacity:1");
    svg.select(posicion1).attr('style', abajoblancaopaca);

    var new_puente = new Object();
    new_puente.color = colorficha1;
    new_puente.ficha1 = colorficha1;
    new_puente.ficha2 = posicion2;
    new_puente.ficha3 = posicion3;
    puentes.push(new_puente);
  }

}


