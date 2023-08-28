const fs = require('fs');

const express = require('express');
const app = express();
const port = 3000;

const server = app.listen(port, () => {
    console.log(`FLOMMO on port ${port}`)
});


const { Server } = require("socket.io");
const io = new Server(server, {
    maxHttpBufferSize: 1e8 // 100 MB
})

app.use(express.static('public'));

const vidsPath = "./public/sources/vids";
const hydraPath = "./public/sources/hydra";
const p5Path = "./public/sources/p5";

io.on("connection", (socket) => {
    socket.on("uploadVid", (file, callback) => {
        //console.log(file)

        fs.writeFile("./public/sources/vids/" + file.name, file.data, (err) => {
            callback({ message: err ? "failure" : "success" })
        })
        io.emit('srcUpdate', '.');
    })

    socket.on("uploadHydra", (file, callback) => {
        //console.log(file)

        fs.writeFile("./public/sources/hydra/" + file.name, file.data, (err) => {
            callback({ message: err ? "failure" : "success" })
        })
        io.emit('srcUpdate', '.');
    })

    socket.on("uploadP5", (file, callback) => {
        //console.log(file)

        fs.writeFile("./public/sources/p5/" + file.name, file.data, (err) => {
            callback({ message: err ? "failure" : "success" })
        })
        io.emit('srcUpdate', '.');
    })
})


/*
app.get('/upload', (req, res) => {
    //don't forget to sanitize inputs
    console.log(req);
    var name = req.query.name;
    var file = req.query.myFile;
    res.send("name received = " + name)
    /*
    fs.writeFile(`${p5Path}/${name}.txt`, 'This is a test file!', function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
      });
      */ /*
}) */

app.get('/srclist', (req, res) => {
    var vids = [];
    var hydras = [];
    var p5s = [];

    if(fs.existsSync(vidsPath) && fs.existsSync(hydraPath) && fs.existsSync(p5Path)){
        vids = fs.readdirSync(vidsPath);
        hydras = fs.readdirSync(hydraPath);
        p5s = fs.readdirSync(p5Path);

        if(vids[0] === ".DS_Store") vids.shift();
        if(hydras[0] === ".DS_Store") hydras.shift();
        if(p5s[0] === ".DS_Store") p5s.shift();
    }

    res.send({"vids":vids, "hydras":hydras, "p5s":p5s});
});
