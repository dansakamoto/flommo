const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
    console.log(`FLOMMO on port ${port}`)
});

app.use(express.static('public'));

const fs = require('fs');
const mediaPath = "./public/media";
const movs = fs.readdirSync(mediaPath);

app.get('/movlist', (req, res) => {
    res.send(movs);
});
