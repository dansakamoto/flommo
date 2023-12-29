import fs from "fs";
import { srcpath, typepaths } from "./fileManager.js";

export function srcList(req, res) {
  const ROOM = req.query.room;
  let sources = {};
  for (const [type, path] of Object.entries(typepaths)) {
    sources[type] = [];
    if (fs.existsSync(srcpath + ROOM + path)) {
      sources[type] = fs.readdirSync(srcpath + ROOM + path);
      if (sources[type][0] === ".DS_Store") sources[type].shift();
    }
  }
  res.send(sources);
}
