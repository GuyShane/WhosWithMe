const http=require('http');
const path=require('path');
const unlock=require('unlock-node');
const express=require('express');
const bodyParser=require('body-parser');

const db=require('./utils/db');
const routes=require('./routes');

const app=express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(unlock.verifyRequest);

app.use('/', routes);

(async ()=>{
    await db.connect();
})();

const server=http.createServer(app);
unlock.init({
    server: server,
    apiKey: process.env.WHOS_WITH_ME_API_KEY,
    version: 1,
    onResponse: function(socket, data){
        console.log(data);
        socket.send(data);
    }
});
server.listen(3000);
