window.onload = () => {

    // FUNCIONES
    function comoJugar() {
        var pre = document.createElement('pre');
        //custom style.
        /*pre.style.maxHeight = "400px";
        pre.style.margin = "0";
        pre.style.padding = "24px";
        pre.style.whiteSpace = "pre-wrap";
        pre.style.textAlign = "justify";*/
        /*pre.style.maxWidth = "900px";*/
        pre.appendChild(document.createTextNode($('#divComoJugar').text()));
        //show as confirm
        alertify.confirm(pre, function () {
            //alertify.success('Accepted');
            console.log("Aceptado");
        }, function () {
            //alertify.warning('Salir');
        }).set({ labels: { cancel: 'Salir' }, padding: false });
    }

    /* COGER ID's HTML */
    var welcome = document.getElementById("welcomeUser"),
        copyrightFooter = document.getElementById("footer1"),
        divComoJugar = document.getElementById("divComoJugar"),
        btnComoJugar = document.getElementById("comojugar");

    // RECUPERAR EL NOMBRE DE USUARIO DEL ALMACENAMIENTO DE SESIÓN
    var nick = sessionStorage.getItem("user");

    //console.log('Nombre de usuario en index.html: ' + nick);

    if (nick != undefined) { // Si no está undefined (vacío) significa que hay un usuario logueado
        welcome.innerHTML = "Bienvenido/a <span id='nombreUsuario'><a href='/perfil' data-toggle='tooltip' title='Perfil'>" + nick + "</a></span>!";

        // Creación del nuevo link
        var cerrarSesion = document.createElement("a"),
            contenido = document.createTextNode("Cerrar sesión");
        cerrarSesion.appendChild(contenido);
        cerrarSesion.setAttribute("href", "salir"),
            cerrarSesion.setAttribute("id", "cerrarSesion");

        var parentDiv = document.getElementById("containerOpciones");

        parentDiv.appendChild(cerrarSesion);
    } else {
        welcome.innerHTML = "Bienvenido/a <span id='nombreUsuario'>anónimo/a</span>!";

        // Creación del nuevo link
        var iniciarSesion = document.createElement("a"),
            contenido = document.createTextNode("Iniciar sesión");
        iniciarSesion.appendChild(contenido);
        iniciarSesion.setAttribute("href", "/login"),
            iniciarSesion.setAttribute("id", "iniciarSesion");

        var parentDiv = document.getElementById("containerOpciones");

        parentDiv.appendChild(iniciarSesion);


        // Creación del nuevo link
        var registro = document.createElement("a"),
            contenido = document.createTextNode("Regístrate");
        registro.appendChild(contenido);
        registro.setAttribute("href", "/signup"),
            registro.setAttribute("id", "registrarse");

        var div = document.getElementById("iniciarSesion");

        var parentDiv = div.parentNode;

        parentDiv.insertBefore(registro, div.nextSibling);
    }

    ///////////////////////////

    /* DESHABILITAR BOTÓN DE JUGAR SI NO SE ESTÁ LOGUEADO */
    if (nick == undefined) { // si no devuelve ningún usuario
        document.getElementById("opcionJugar").setAttribute("class", "deshabilitado"); // Añade al li la clase deshabilitado definida en el css
    }

    // Poner año actual en el footer
    var fecha = new Date();
    var year = fecha.getFullYear();
    copyrightFooter.innerHTML = copyrightFooter.innerHTML + " " + year;

    // DEFINICIÓN DE EVENTOS EN LOS BOTONES
    btnComoJugar.addEventListener("click", comoJugar);

    /*var pre = document.createElement('pre');
    //custom style.
    pre.style.maxHeight = "400px";
    pre.style.margin = "0";
    pre.style.padding = "24px";
    pre.style.whiteSpace = "pre-wrap";
    pre.style.textAlign = "right";
    pre.appendChild(document.createTextNode($('#divComoJugar').text()));
    //show as confirm
    alertify.confirm(pre, function () {
        //alertify.success('Accepted');
        console.log("Aceptado");
    }, function () {
        //alertify.warning('Salir');
    }).set({ labels: { cancel: 'Salir' }, padding: false });*/

}