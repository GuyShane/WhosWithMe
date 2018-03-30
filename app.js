const http=require('http');
const path=require('path');
const express=require('express');

const db=require('./utils/db');
const routes=require('./routes');

const app=express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

(async ()=>{
    await db.connect();
})();

const server=http.createServer(app);
server.listen(3000);
