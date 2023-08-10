const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`FLOMMO on port ${port}`)
});

app.use(express.static('public'));

const fs = require('fs');

const vidsPath = "./public/sources/vids";
const hydraPath = "./public/sources/hydra";
const p5Path = "./public/sources/p5";

app.get('/srclist', (req, res) => {
    var vids = fs.readdirSync(vidsPath);
    var hydras = fs.readdirSync(hydraPath);
    var p5s = fs.readdirSync(p5Path);

    if(vids[0] === ".DS_Store") vids.shift();
    if(hydras[0] === ".DS_Store") hydras.shift();
    if(p5s[0] === ".DS_Store") p5s.shift();

    res.send({"vids":vids, "hydras":hydras, "p5s":p5s});
});
