const http=require('http');
const express=require('express');

const db=require('./utils/db');

const app=express();

(async ()=>{
    await db.connect();
})();

const server=http.createServer(app);
server.listen(3000);
