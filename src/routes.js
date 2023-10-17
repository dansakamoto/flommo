const fs = require('fs');
const SRCPATH = process.env.SRCPATH;
const TYPEPATHS = {
    "vids": process.env.VIDSPATH,
    "hydras": process.env.HYDRAPATH,
    "p5s": process.env.P5PATH
};

exports.srcList = function(req, res) {
    const ROOM = req.query.room;
    let sources = {};
    for(const [type,path] of Object.entries(TYPEPATHS)){
        sources[type] = []
        if(fs.existsSync(SRCPATH + ROOM + path)){
            sources[type] = fs.readdirSync(SRCPATH + ROOM + path);
            if(sources[type][0] === ".DS_Store") sources[type].shift();
        }
    }
    res.send(sources);
}
