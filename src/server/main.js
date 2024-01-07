import "dotenv/config.js";
import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";
import { srcList } from "./routes/srcList.js";
import { addSrc, delSrc } from "./utils/data.js";

const app = express();
const port = 3000;

var server = app.listen(port, () => {
  console.log(`FLOMMO @ http://localhost:${port}`);
});

app.use(express.static("public"));

ViteExpress.bind(app, server);

app.get("/srclist", srcList);

const io = new Server(server, {
  maxHttpBufferSize: 1e8 /* 100 MB */,
  serveClient: false,
});
io.on("connection", (socket) => {
  socket.on("uploadSrc", addSrc);
  socket.on("delSrc", delSrc);
});
