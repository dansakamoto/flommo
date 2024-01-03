import fs from "fs";

const srcPath = "./public/uploads";
const typePaths = {
  vid: "vids",
  hydra: "hydra",
  p5: "p5",
};

export function initFs() {
  fs.mkdirSync(srcPath, { recursive: true });
}

function initRoom(room) {
  if (!room) {
    console.error("cannot init room: missing room number");
    return;
  }
  for (const t in typePaths) {
    fs.mkdirSync(`${srcPath}/${room}/${typePaths[t]}`, { recursive: true });
  }
}

export function getSources(room) {
  const sources = {};
  for (const [type, path] of Object.entries(typePaths)) {
    sources[type] = [];
    if (fs.existsSync(`${srcPath}/${room}/${path}`)) {
      sources[type] = fs.readdirSync(`${srcPath}/${room}/${path}`);
      if (sources[type][0] === ".DS_Store") sources[type].shift();
    }
  }
  return sources;
}

export function uploadSrc(file, callback) {
  const room = file.room;
  const type = file.type;
  const path = typePaths[type];
  const ts = Date.now();
  let name, data;

  console.log(file);

  initRoom(room);

  if (type === "vid") {
    name = file.name;
    data = file.data;
  } else if (type === "hydra") {
    name = `h${ts}.js`;
    data = `function h${ts}(f){const { src, osc, gradient, shape, voronoi, noise, s0, s1, s2, s3, o0, o1, o2, o3, render } = f;${file.src}}`;
  } else if (type === "p5") {
    name = `p${ts}.js`;
    data = `var p${ts} = ( f ) => {${file.src}}`;
  }

  fs.writeFile(`${srcPath}/${room}/${path}/${name}`, data, (err) => {
    if (err) console.error(err);
    callback({ message: err ? "failure" : "success" });
  });
}

export function delSrc(msg, callback) {
  const type = msg.type;
  const name = msg.name;
  const room = msg.room;
  let typePath;

  if (type === "h") typePath = typePaths.hydra;
  else if (type === "p") typePath = typePaths.p5;
  else if (type === "v") typePath = typePaths.vid;

  fs.unlink(`${srcPath}/${room}/${typePath}/${name}`, (err) => {
    callback({ message: err ? "failure" : "success" });
  });
}
