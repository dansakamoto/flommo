require('dotenv').config()
const fs = require('fs');
const express = require('express');
const app = express();
const https = require('https');

const port = process.env.PORT || 3000;
const srcPath = "./public/sources/";
const vidsPath = "/vids/";
const hydraPath = "/hydra/";
const p5Path = "/p5/";

//  First time directory structure initilization
if(!fs.existsSync(srcPath)){
    console.log("sources directory doesn't exist, creating")
    fs.mkdir(srcPath, (err) => {
        if(err){ console.log(err) }
    });
}

//  Server init
var server;
if(port === "443"){
     var privateKey = fs.readFileSync(process.env.SSL_KEY_PATH)
     var certificate = fs.readFileSync(process.env.SSL_CERT_PATH)
     server = https.createServer({
        key: privateKey,
        cert: certificate
     }, app).listen(port);
     console.log(`FLOMMO on port 443`);
} else {
    server = app.listen(port, () => {
        console.log(`FLOMMO @ http://localhost:${port}`)
    });
}

//  Static directory
app.use(express.static('public'));

//  Routes
app.get('/srclist', (req, res) => {
    var vids = [];
    var hydras = [];
    var p5s = [];
    var room = req.query.room;

    if(fs.existsSync(srcPath + room + vidsPath)){
        vids = fs.readdirSync(srcPath + room + vidsPath);
        if(vids[0] === ".DS_Store") vids.shift();
    }

    if(fs.existsSync(srcPath + room + hydraPath)){
        hydras = fs.readdirSync(srcPath + room + hydraPath);
        if(hydras[0] === ".DS_Store") hydras.shift();
    }

    if(fs.existsSync(srcPath + room + p5Path)){
        p5s = fs.readdirSync(srcPath + room + p5Path);
        if(p5s[0] === ".DS_Store") p5s.shift();
    }

    res.send({"vids":vids, "hydras":hydras, "p5s":p5s});
});

//  Sockets
const { Server } = require("socket.io");
const io = new Server(server, {
    maxHttpBufferSize: 1e8 // 100 MB
})
io.on("connection", (socket) => {

    socket.on("uploadVid", (file, callback) => {

        const room = file.room;
        console.log("room is " + room)

        if(!fs.existsSync(srcPath + room)){
            fs.mkdir(srcPath + room, (err) => {
                if(!fs.existsSync(srcPath + room + vidsPath)){
                    console.log("making "+ srcPath + room + vidsPath)
                    fs.mkdir(srcPath + room + vidsPath,(err) => {
                        fs.writeFile(srcPath + room + vidsPath + file.name, file.data, (err) => {
                            console.log(err)
                            callback({ message: err ? "failure" : "success" })
                        })
                    });
                }
            });
        } else if(!fs.existsSync(srcPath + room + vidsPath)){
            console.log("making "+ srcPath + room + vidsPath)
            fs.mkdir(srcPath + room + vidsPath,(err) => {
                fs.writeFile(srcPath + room + vidsPath + file.name, file.data, (err) => {
                    console.log(err)
                    callback({ message: err ? "failure" : "success" })
                })
            });
        } else {
            fs.writeFile(srcPath + room + vidsPath + file.name, file.data, (err) => {
                console.log(err)
                callback({ message: err ? "failure" : "success" })
            })
        }
    });

    socket.on("uploadHydra", (code, callback) => {
        console.log("uploading Hydra")

        const room = code.room;
        console.log(room)

        ts = Date.now();
        code.src = "function h" + ts + "(f){" + code.src + "}";

        if(!fs.existsSync(srcPath + room)){
            fs.mkdir(srcPath + room, (err) => {
                if(!fs.existsSync(srcPath + room + hydraPath)){
                    console.log("making "+ srcPath + room + hydraPath)
                    fs.mkdir(srcPath + room + hydraPath,(err) => {
                        fs.writeFile(srcPath + room + hydraPath + "h" + ts + ".js", code.src, (err) => {
                            callback({ message: err ? "failure" : "success" })
                        })
                    });
                }
            });
        } else if(!fs.existsSync(srcPath + room + hydraPath)){
            console.log("making "+ srcPath + room + hydraPath)
            fs.mkdir(srcPath + room + hydraPath,(err) => {
                fs.writeFile(srcPath + room + hydraPath + "h" + ts + ".js", code.src, (err) => {
                    callback({ message: err ? "failure" : "success" })
                })
            });
        } else {
            fs.writeFile(srcPath + room + hydraPath + "h" + ts + ".js", code.src, (err) => {
                callback({ message: err ? "failure" : "success" })
            })
        }

    })

    socket.on("uploadP5", (code, callback) => {
        console.log("uploading P5")

        const room = code.room;
        console.log(room)
        ts = Date.now();
        code.src = "var p" + ts + " = ( f ) => {" + code.src + "}";

        if(!fs.existsSync(srcPath + room)){
            fs.mkdir(srcPath + room, (err) => {
                if(!fs.existsSync(srcPath + room + p5Path)){
                    console.log("making "+ srcPath + room + p5Path)
                    fs.mkdir(srcPath + room + p5Path,(err) => {
                        fs.writeFile(srcPath + room + p5Path + "p" + ts + ".js", code.src, (err) => {
                            callback({ message: err ? "failure" : "success" })
                        })
                    });
                }
            });
        } else if(!fs.existsSync(srcPath + room + p5Path)){
            console.log("making "+ srcPath + room + p5Path)
            fs.mkdir(srcPath + room + p5Path,(err) => {
                fs.writeFile(srcPath + room + p5Path + "p" + ts + ".js", code.src, (err) => {
                    callback({ message: err ? "failure" : "success" })
                })
            });
        } else {
            fs.writeFile(srcPath + room + p5Path + "p" + ts + ".js", code.src, (err) => {
                callback({ message: err ? "failure" : "success" })
            })
        }
    })

    socket.on("delSrc", (msg, callback) => {

        const type = msg.type;
        const name = msg.name;
        const room = msg.room;
        let typePath;
        if (type === "h") typePath = hydraPath;
        else if(type === "p") typePath = p5Path;
        else typePath = vidsPath;

        console.log(type);
        console.log(srcPath + room + typePath + name)

        fs.unlink(srcPath + room + typePath + name, (err) => {
            callback({ message: err ? "failure" : "success"});
        });

    });
})
