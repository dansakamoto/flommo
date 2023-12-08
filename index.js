import express from "express";
import { Server } from "socket.io";
import { srcList } from "./src/routes.js";
import { initFs, uploadSrc, delSrc } from "./src/fileManager.js";
const app = express();
const port = 3000;

initFs();

var server = app.listen(port, () => {
  console.log(`FLOMMO @ http://localhost:${port}`);
});

app.use(express.static("public"));
app.get("/srclist", srcList);

const io = new Server(server, { maxHttpBufferSize: 1e8 /* 100 MB */ });
io.on("connection", (socket) => {
  socket.on("uploadSrc", uploadSrc);
  socket.on("delSrc", delSrc);
});
