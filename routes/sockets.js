//conexion a socket del servidor
const mensajes = require('../models/mensajes');

module.exports = function (io) {
    //console.log('nuevo socket');
    let usuarios = {};
    let usr = [];

    io.on('connection', async socket => {
        let msgs = await mensajes.find({}).limit(10).sort({$natural:-1});
        socket.emit('carga msg', msgs);
        //console.log('nuevo socket');
        socket.on('nuevo usuario', (data, cb) => {
            if(data in usuarios){
                cb(false);
            } else{
                cb(true);
                //console.log(socket);
                socket.nickname = data;
                usuarios[socket.nickname] = socket;

                let usuariosYestado = {};
                usuariosYestado["nickname"] = socket.nickname;
                usuariosYestado["estado"] = "Online";
                //console.log(usuarios);
                //console.log(Object.keys(usuarios));
                usr.push(usuariosYestado);
                //console.log(usr);
                io.sockets.emit('conectado', socket.nickname);
                usuarios[socket.nickname].emit('titulo conectado', socket.nickname);
                //updateEstado();
                updateNicknames();
            }
        });

        socket.on('enviar mensaje', async (data, cb) => {
            var msg = data.trim();
            //console.log(msg);

            if(msg.substr(0,5) === '/msg '){
                msg = msg.substr(5);
                const index = msg.indexOf(' ');
                if(index !== -1){
                    var name = msg.substr(0, index);
                    msg = msg.substr(index + 1);
                    if(name in usuarios){
                        usuarios[name].emit('mensaje', {
                            msg,
                            nick: socket.nickname
                        });
                    } else {
                        cb('No existe el usuario');
                    }
                } else{
                    cb('Ingresa un mensaje');
                }
            } else{
                var newMsg = new mensajes({
                    nick: socket.nickname,
                    msg
                });
                await newMsg.save();
    
                io.sockets.emit('nuevo mensaje', {
                    msg: data,
                    nick: socket.nickname
                });
            }            
        });

        socket.on('disconnect', data => {
            if(!socket.nickname) return;
            io.sockets.emit('desconectado', socket.nickname);
            var index;
            for (let i = 0; i < usr.length; i++) {
                if(usr[i].nickname == socket.nickname){
                    index = i;
                    break;
                }
            }
            usr.splice(index, 1);
            //console.log(usr);
            delete usuarios[socket.nickname];
            updateNicknames();
        });

        socket.on('boton', data => {
            //console.log(socket.nickname);
            //console.log(data);
            for(var i=0; i<usr.length; i++){
                if(usr[i].nickname == socket.nickname){
                    usr[i].estado = data;
                    break;
                }
            }
            updateNicknames();
        });

        socket.on('mensaje privado', data => { //aqui se debe obtener el nickname de a quien se le va a enviar el mensaje

        });

        function updateNicknames() {
            //io.sockets.emit('usernames', Object.keys(usuarios));
            io.sockets.emit('usernames', usr);
        }
    });
}