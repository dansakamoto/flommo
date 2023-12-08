import fs from "fs";

export const srcpath = "./public/uploads/";
export const typepaths = {
  vid: "/vids/",
  hydra: "/hydra/",
  p5: "/p5/",
};

export function initFs() {
  if (!fs.existsSync(srcpath)) {
    fs.mkdir(srcpath, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}

export function uploadSrc(file, callback) {
  const ROOM = file.room;
  const TYPE = file.type;
  const PATH = typepaths[TYPE];
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

  if (!fs.existsSync(srcpath + ROOM)) {
    fs.mkdir(srcpath + ROOM, (err) => {
      if (err) return console.error(err);
      if (!fs.existsSync(srcpath + ROOM + PATH)) {
        console.log("making " + srcpath + ROOM + PATH);
        fs.mkdir(srcpath + ROOM + PATH, (err) => {
          if (err) return console.error(err);
          fs.writeFile(srcpath + ROOM + PATH + name, data, (err) => {
            console.log(err);
            callback({ message: err ? "failure" : "success" });
          });
        });
      }
    });
  } else if (!fs.existsSync(srcpath + ROOM + PATH)) {
    console.log("making " + srcpath + ROOM + PATH);
    fs.mkdir(srcpath + ROOM + PATH, (err) => {
      if (err) return console.error(err);
      fs.writeFile(srcpath + ROOM + PATH + name, data, (err) => {
        console.log(err);
        callback({ message: err ? "failure" : "success" });
      });
    });
  } else {
    fs.writeFile(srcpath + ROOM + PATH + name, data, (err) => {
      console.log(err);
      callback({ message: err ? "failure" : "success" });
    });
  }
}

export function delSrc(msg, callback) {
  const TYPE = msg.type;
  const NAME = msg.name;
  const ROOM = msg.room;
  let typePath;

  if (TYPE === "h") typePath = typepaths.hydra;
  else if (TYPE === "p") typePath = typepaths.p5;
  else typePath = typepaths.vid;

  console.log(TYPE);
  console.log(srcpath + ROOM + typePath + NAME);

  fs.unlink(srcpath + ROOM + typePath + NAME, (err) => {
    callback({ message: err ? "failure" : "success" });
  });
}
