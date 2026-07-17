import "dotenv/config.js";
import express from "express";
import ViteExpress from "vite-express";
import { Server } from "socket.io";
import { srcList } from "./routes/srcList.js";
import {
  addSrc,
  delSrc,
  updateSrc,
  dbConnect,
  updateMixer,
  initFromDemo,
} from "./utils/data.js";

dbConnect();
const app = express();
const port = 3000;

var server = app.listen(port, () => {
  console.log(`FLOMMO @ http://localhost:${port}`);
});

if (process.env.NODE_ENV == "production") {
  app.use("/", express.static("dist"));
  console.log("Running in production mode");
} else {
  ViteExpress.bind(app, server);
  console.log("Running in development mode");
}

app.get("/srclist", srcList);

const io = new Server(server, {
  maxHttpBufferSize: 1e8 /* 100 MB */,
  serveClient: false,
});
io.on("connection", (socket) => {
  socket.on("uploadSrc", addSrc);
  socket.on("delSrc", delSrc);
  socket.on("updateSrc", updateSrc);
  socket.on("updateMixer", updateMixer);
  socket.on("initFromDemo", initFromDemo);
});
