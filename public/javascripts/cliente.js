//conexion a socket del cliente
$(function () {
    const socket = io();

    //obtener elementos del nicknameform
    const nickError = $('#nickError');
    const nickForm = $('#nickForm');
    const nickname = $('#nickname');

    //obtener elementos del messageform y usersform
    const messageForm = $('#message-form');
    const messageBox = $('#message');
    const titulo = $('#titulo');
    const chat = $('#chat');
    const usernames = $('#usernames');

    //obtener elementos de estado
    const estadoOnlineForm = $('#estadoOnlineForm');
    const online = $('#online');
    const estadoOcupadoForm = $('#estadoOcupadoForm');
    const ocupado = $('#ocupado');
    const estadoNoDisponibleForm = $('#estadoNoDisponibleForm');
    const noDisponible = $('#noDisponible');

    const chats = $('#chats');
    const messageformpriv = $('#message-form-priv');
    const messagepriv = $('#messagepriv');

    //eventos del registro de usuarios
    nickForm.submit(e => {
        e.preventDefault();
        socket.emit('nuevo usuario', nickname.val(), data => {
            if(data){
                $('#nickMain').hide();
                $('#contentMain').show();
            }else{
                nickError.html(`
                    <div class="alert alert-danger">
                        Este usuario ya existe
                    </div>
                `);
            }
        });
    });

    //eventos del chat
    messageForm.submit(e => {
        e.preventDefault();
        socket.emit('enviar mensaje', messageBox.val(), data => {
            chat.append(`<p class="error">${data}</p>`);
        });
        socket.emit('ferret', 'usuario', res => {
            console.log(res);
        });
        messageBox.val('');
    });

    messageformpriv.submit(e => {
        e.preventDefault();
        socket.emit('mensaje privado', messagepriv.val(), data => {
            chat.append(`<p class="error">${data}</p>`);
        });
        mmessagepriv.val('');
    });

    //eventos de los botones de estado
    estadoOnlineForm.submit(e => {
        e.preventDefault();
        console.log(online.val());
        socket.emit('boton', online.val());
    });

    estadoOcupadoForm.submit(e => {
        e.preventDefault();
        console.log(ocupado.val());
        socket.emit('boton', ocupado.val());
    });

    estadoNoDisponibleForm.submit(e => {
        e.preventDefault();
        console.log(noDisponible.val());
        socket.emit('boton', noDisponible.val());
    });

    //escuchar eventos
    socket.on('nuevo mensaje', function (data) {
        chat.append('<b>' + data.nick + '</b>: ' + data.msg + '<br>');
    });

    socket.on('usernames', data => {
        let html = '';
        for(let i=0; i<data.length; i++){
            html +=`<p><a href="chatear.html" target="_blank" value="${data[i].nickname}">${data[i].nickname}</a> - ${data[i].estado}</p>`;
        }
        usernames.html(html);
    });

    socket.on('mensaje', data => {
        chat.append(`<b class="mensajepriv">${data.nick}: ${data.msg}</b>`);
    });

    socket.on('carga msg', data => {
        //for(let i=0; i<data.length; i++){
        for(let i=data.length-1; i>=0; i--){
            mostrarMsgs(data[i]);
        }
    });

    socket.on('conectado', data => {
        chat.append('<b class="conectado">' + data + ': Se ha conectado</b><br>');
    });

    socket.on('desconectado', data => {
        chat.append('<b class="desconectado">' + data + ': Se ha desconectado</b><br>');
    });

    socket.on('titulo conectado', data => {
        titulo.append(`<h4>Welcome to Chatingo ${data}</h4>`);
    });

    socket.on('mensajes eliminados', function(data, n) {
        chat.append(`<b class="eliminados"> ${n} mensajes de ${data} eliminados</b><br>`);
    });

    //funciones
    function mostrarMsgs(data) {
        chat.append(`<b>${data.nick}</b>: ${data.msg}<br>`);
    }
})