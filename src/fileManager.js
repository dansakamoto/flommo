const fs = require('fs');
const SRCPATH = process.env.SRCPATH;
const SRCTYPES = {
    "vid": process.env.VIDSPATH,
    "hydra": process.env.HYDRAPATH,
    "p5": process.env.P5PATH
};

exports.uploadSrc = function(file, callback) {
    const ROOM = file.room;
    const TYPE = file.type;
    const PATH = SRCTYPES[TYPE];
    let name, data, ts;

    switch (TYPE) {
        case "vid":
            name = file.name;
            data = file.data;
            break;
        case "hydra":
            ts = Date.now();
            name = "h" + ts + ".js";
            data = "function h" + ts + "(f){" + file.src + "}";
            break;
        case "p5":
            ts = Date.now();
            name = "p" + ts + ".js";
            data = "var p" + ts + " = ( f ) => {" + file.src + "}";
            break;
    }

    if (!fs.existsSync(SRCPATH + ROOM)) {
        fs.mkdir(SRCPATH + ROOM, (err) => {
            if (!fs.existsSync(SRCPATH + ROOM + PATH)) {
                console.log("making " + SRCPATH + ROOM + PATH);
                fs.mkdir(SRCPATH + ROOM + PATH, (err) => {
                    fs.writeFile(SRCPATH + ROOM + PATH + name, data, (err) => {
                        console.log(err);
                        callback({ message: err ? "failure" : "success" });
                    });
                });
            }
        });
    } else if (!fs.existsSync(SRCPATH + ROOM + PATH)) {
        console.log("making " + SRCPATH + ROOM + PATH);
        fs.mkdir(SRCPATH + ROOM + PATH, (err) => {
            fs.writeFile(SRCPATH + ROOM + PATH + name, data, (err) => {
                console.log(err);
                callback({ message: err ? "failure" : "success" });
            });
        });
    } else {
        fs.writeFile(SRCPATH + ROOM + PATH + name, data, (err) => {
            console.log(err);
            callback({ message: err ? "failure" : "success" });
        });
    }
}

exports.delSrc = function(msg, callback) {

    const TYPE = msg.type;
    const NAME = msg.name;
    const ROOM = msg.room;
    let typePath;

    if (TYPE === "h") typePath = process.env.HYDRAPATH;
    else if(TYPE === "p") typePath = process.env.P5PATH;
    else typePath = process.env.VIDSPATH;

    console.log(TYPE);
    console.log(SRCPATH + ROOM + typePath + NAME)

    fs.unlink(SRCPATH + ROOM + typePath + NAME, (err) => {
        callback({ message: err ? "failure" : "success"});
    });

}
