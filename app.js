const path=require('path');
const unlock=require('unlock-node');
const express=require('express');
const favicon=require('serve-favicon');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');

const db=require('./utils/db');
const routes=require('./routes');

const app=express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(unlock.verifyRequest);

app.use('/', routes);

(async ()=>{
    await db.connect();
})();

const server=app.listen(3000);
unlock.init({
    server: server,
    apiKey: process.env.API_KEY,
    version: 1,
    cookieName: '_wwmat',
    exp: 7*24*60*60,
    onResponse: function(socket, data){
        let toSend={};
        switch(data.type){
        case unlock.responses.UNLOCKED:
            toSend.success=true;
            toSend.token=data.token;
            break;
        case unlock.responses.NOT_UNLOCKED:
            toSend.success=false;
            if (data.passable){
                toSend.reason=data.message;
            }
            else {
                toSend.reason='Couldn\'t log you in. Sorry';
            }
            break;
        case unlock.responses.ERROR:
            toSend.success=false;
            toSend.message='Couldn\'t log you in. Sorry';
            break;
        }
        socket.send(JSON.stringify(toSend));
    }
});
