import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";
import { srcList } from "./routes.js";
import { initFs, uploadSrc, delSrc } from "./fileManager.js";
const app = express();
const port = 3000;

initFs();

var server = app.listen(port, () => {
  console.log(`FLOMMO @ http://localhost:${port}`);
});

ViteExpress.bind(app, server);

//app.use(express.static("public"));
app.get("/srclist", srcList);

const io = new Server(server, { maxHttpBufferSize: 1e8 /* 100 MB */ });
io.on("connection", (socket) => {
  socket.on("uploadSrc", uploadSrc);
  socket.on("delSrc", delSrc);
});
