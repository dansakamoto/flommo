require('dotenv').config()
const fs = require('fs');

const SRCPATH = process.env.SRCPATH;
if(!fs.existsSync(SRCPATH)){ // init fs
    fs.mkdir(SRCPATH, (err) => {
        if(err){ console.log(err) }
    });
}

const express = require('express');
const app = express();
const https = require('https');
const PORT = process.env.PORT || 3000;

var server;
if(PORT === "443"){
     var privateKey = fs.readFileSync(process.env.SSL_KEY_PATH)
     var certificate = fs.readFileSync(process.env.SSL_CERT_PATH)
     server = https.createServer({
        key: privateKey,
        cert: certificate
     }, app).listen(PORT);
     console.log(`FLOMMO on port 443`);
} else {
    server = app.listen(PORT, () => {
        console.log(`FLOMMO @ http://localhost:${PORT}`)
    });
}

app.use(express.static('public'));

const { srcList } = require('./src/routes.js');
app.get('/srclist', srcList);

const { Server } = require("socket.io");
const { uploadSrc, delSrc } = require('./src/fileManager.js');
const io = new Server(server, { maxHttpBufferSize: 1e8 /* 100 MB */ })
io.on("connection", (socket) => {
    socket.on("uploadSrc", uploadSrc);
    socket.on("delSrc", delSrc);
})
