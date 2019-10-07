import path from 'path';
import polka from 'polka';
import sirv from 'sirv';
import compression from 'compression';

const page=`
<!doctype html>
<html>
  <head>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width'>

    <title>Who's With Me?</title>

    <link rel='icon' type='image/png' href='/favicon.png'>
    <link rel='stylesheet' href='/global.css'>
    <link rel='stylesheet' href='/bundle.css'>

    <script defer src='/bundle.js'></script>
  </head>

  <body>
  </body>
</html>
`;

const statics=sirv(path.join(__dirname, '../frontend/dist'));
const compressor=compression();

const app=polka();
app.use(statics, compressor);

app.get('*', (req, res)=>{
    res.write(page);
    res.end();
});

app.listen(3000, err=>{
    console.log('Server listening');
});
