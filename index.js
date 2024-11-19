/*imports dos pacotes :
-express
-ejs
-http
-path
-socket.io */

const express=require('express');
const ejs=require('ejs');
const http=require('http');
const path=require('path');
const socketIO=require('socket.io');

/*instançias do express
-express
-server
-socketIO */
const app = express();
const server = http.createServer(app);
const io =socketIO(server);

/*
define a pasta estatica
*/
app.use(express.static(path.join))(__dirname,'public')

app.set('Views',path.join(__dirname,'public'))
app.engine('html',ejs.renderFile)

/* rota raiz '/' para acessar o index da aplicação*/ 

app.use('/', (req,res) =>{
    res.render('index.html');
});

/* inicio do cod do chat */

/* array que armazena as mensagens */
let messages =[];

/*cria a conexão com socket io*/

io.on('connection', socket=>{
    console.log('novo usuario conectado! id: ' + socket.id)
});
/*fim do cod do chat */
/*
Criação do servidor http
*/

server.listen(3000, ()=> {
    console.log('Servidor do web chat rodando em -> http://localhost:3000')
});