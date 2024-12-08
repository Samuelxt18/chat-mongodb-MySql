
//back 
/*
    import dos pacotes:
    -express
    -ejs
    -http
    -path
    -socket
*/
const express = require('express');
const ejs=require('ejs');
const http = require('http');
const path= require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

/* 

    instancias 
*/
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
/* Importa o pacote do mongoose: */
/*
define a localização da pasta estatica 
*/
app.use(express.static(path.join(__dirname, 'public')));//acha o caminho estaticos 

/* 
    define o ejs como a chave de inicialização 
*/
// app.set('view engine', 'html')
app.set('views',path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);


app.use('/', (req,res) =>{
    res.sendFile(path.join( 'index.html'));
});

/*Conexão com o MongoDB: */
function connectDB() {

    /* URL de conexão com o Atlas mongoDB: */
    let dbUrl = 'mongodb+srv://samuelxtp:QXjioa39ZVi5ihgb@cluster0.ro3opzs.mongodb.net/';

    mongoose.connect(dbUrl);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback(){
        console.log("Atlas mongoDB conectado!");
    });

}
/* Chama a função de conexão com o banco de dados */
connectDB();

/* Define o model */
let Message = mongoose.model('Message',{ author : String, data_hora : String, message : String});

//armazena msgs 

let messages=[];

/*Recupera as mensagens do banco de dados: */
Message.find({})
    .then(docs=>{
        console.log('DOCS: ' + docs);
        messages = docs;
        console.log('MESSAGES: ' + messages);
    }).catch(err=>{
        console.log(err);
    });

// cria conection com o socket.io
io.on('connection', socket=>{

    /* Exibe a título de teste da conexão o id do socket do usuário conectado: */
    console.log(`Novo usuário conectado ${socket.id}`);

    /* Recupera e mantem as mensagens do front para back e vice-versa: */
    socket.emit('previousMessage', messages);

    /* Dispara ações quando recebe mensagens do frontend: */
    socket.on('sendMessage', data => {

    /* Adicona uma mensagem enviada no final do array de mensagens: */
    // messages.push(data);
    let message = new Message(data);
    message.save()
        .then(
            socket.broadcast.emit('receivedMessage', data)
        )
        .catch(err=>{
            console.log('ERRO: ' + err);
        });

    /* Propaga a mensagem enviada para todos os usuário conectados na aplicaçao de chat: */
    // socket.broadcast.emit('receivedMessage', data);

    });

})
/* 
    criação server http 
*/
server.listen(3000, () =>{
    console.log('server funcionando no http://localhost:3000')
});