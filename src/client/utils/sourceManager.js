import Hydra from "hydra-synth";
import p5 from "p5";
import { io } from "socket.io-client";

const params = new URLSearchParams(window.location.search);
const room = params.get("room") ? params.get("room") : Date.now();
if (!params.get("room")) history.pushState({}, "", "?room=" + room);

const socket = io(); // Source update listener
const uploadsDir = "uploads";
const srcWrapper = document.getElementById("srcPreviews");
const togglePanel = document.getElementById("sourceToggles");

export var vids = {},
  hydras = {},
  p5s = {},
  p5Instances = [],
  hydraInstances = [],
  numSources = 0;

function initSources(sourceList) {
  (vids = {}), (hydras = {}), (p5s = {});
  (p5Instances = []), (hydraInstances = []);
  numSources = 0;

  while (srcWrapper.firstChild) srcWrapper.removeChild(srcWrapper.firstChild);
  while (togglePanel.firstChild)
    togglePanel.removeChild(togglePanel.firstChild);

  var i = 0;
  for (let p of sourceList["p5"]) {
    const scriptElement = document.createElement("script");
    scriptElement.src = uploadsDir + "/" + room + "/p5/" + p;
    scriptElement.async = true;

    scriptElement.p = p;
    scriptElement.i = i;

    scriptElement.onload = function () {
      var loc = this.p.substring(0, this.p.lastIndexOf("."));
      var canvasID = "p5Canvas" + this.i;
      p5Instances.push(new p5(window[loc], canvasID));
    };
    document.body.appendChild(scriptElement);

    const dElement = document.createElement("div");
    dElement.classList.add("inputDiv");

    const srcLabel = document.createElement("div");
    srcLabel.classList.add("srcLabel");
    srcLabel.innerHTML = numSources + 1;

    const p5Div = document.createElement("div");
    p5Div.id = "p5Canvas" + i;
    p5Div.classList.add("inputSrc");

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.innerHTML = "X";
    closeButton.addEventListener("click", () => {
      delSrc("p", p);
    });

    srcWrapper.appendChild(dElement);
    dElement.appendChild(p5Div);
    dElement.appendChild(srcLabel);

    dElement.appendChild(closeButton);

    p5s["p5Canvas" + i] = p;
    i++;
    numSources++;
  }

  i = 0;
  for (let h of sourceList["hydra"]) {
    const scriptElement = document.createElement("script");
    scriptElement.src = uploadsDir + "/" + room + "/hydra/" + h;
    scriptElement.async = true;

    scriptElement.h = h;
    scriptElement.i = i;

    scriptElement.onload = function () {
      var loc = this.h.substring(0, this.h.lastIndexOf("."));
      var canvasID = "hydraCanvas" + this.i;

      console.log(window[loc]);

      hydraInstances.push(
        new Hydra({
          makeGlobal: false,
          canvas: document.getElementById(canvasID),
          detectAudio: false,
          autoLoop: false,
        }).synth
      );

      window[loc](hydraInstances[this.i]);
    };
    document.body.appendChild(scriptElement);

    const dElement = document.createElement("div");
    dElement.classList.add("inputDiv");

    const srcLabel = document.createElement("div");
    srcLabel.classList.add("srcLabel");
    srcLabel.innerHTML = numSources + 1;

    const hydraCanv = document.createElement("canvas");
    hydraCanv.id = "hydraCanvas" + i;
    hydraCanv.classList.add("inputSrc");
    hydraCanv.width = 720;
    hydraCanv.height = 400;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.innerHTML = "X";

    srcWrapper.appendChild(dElement);
    dElement.appendChild(hydraCanv);
    dElement.appendChild(srcLabel);

    dElement.appendChild(closeButton);
    dElement.appendChild(document.createElement("br"));

    closeButton.addEventListener("click", () => {
      delSrc("h", h);
    });

    hydras["hydraCanvas" + i] = h;
    i++;
    numSources++;
  }

  i = 0;
  for (let v of sourceList["vid"]) {
    const dElement = document.createElement("div");
    dElement.classList.add("inputDiv");

    const srcLabel = document.createElement("div");
    srcLabel.classList.add("srcLabel");
    srcLabel.innerHTML = numSources + 1;

    const vElement = document.createElement("video");
    vElement.src =
      window.location.origin + "/" + uploadsDir + "/" + room + "/vids/" + v;
    vElement.classList.add("inputSrc");
    vElement.id = "video" + i;
    vElement.width = 720;
    vElement.height = 400;
    vElement.loop = true;
    vElement.autoplay = true;
    vElement.muted = true;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.innerHTML = "X";

    srcWrapper.appendChild(dElement);

    dElement.appendChild(vElement);
    dElement.appendChild(srcLabel);
    dElement.appendChild(closeButton);

    closeButton.addEventListener("click", () => {
      delSrc("v", v);
    });

    vids["video" + i] = v;
    i++;
    numSources++;
  }

  for (let j = 0; j < numSources; j++) {
    const panelDiv = document.createElement("div");
    panelDiv.classList.add("panel");
    panelDiv.innerHTML = `<input type="checkbox" id="on${j + 1}" name="on${
      j + 1
    }" value="on${j + 1}" onchange="toggleSrc(${j + 1})"><label for="on${
      j + 1
    }">Send ${
      j + 1
    }</label><br><input type="range" min="0" max="100" value="100" class="slider" id="alpha${
      j + 1
    }"><br></br>`;

    togglePanel.appendChild(panelDiv);
  }
}
async function getSources(room) {
  const URL = "/srclist?room=" + room;
  const response = await fetch(URL);
  var data = await response.json();
  initSources(data);
}
getSources(room);

window.uploadVid = (files) => {
  console.log(files[0]);
  socket.emit(
    "uploadSrc",
    { room: room, name: files[0].name, type: "vid", data: files[0] },
    (status) => {
      console.log(status);
      if (status.message === "success") {
        getSources(room);
      }
    }
  );
};
export function uploadP5(code) {
  socket.emit("uploadSrc", { room: room, type: "p5", src: code }, (status) => {
    if (status.message === "success") {
      getSources(room);
    }
  });
  console.log(code);
}
export function uploadHydra(code) {
  socket.emit(
    "uploadSrc",
    { room: room, type: "hydra", src: code },
    (status) => {
      console.log(status);
      if (status.message === "success") {
        getSources(room);
      }
    }
  );
}

function delSrc(type, name) {
  socket.emit("delSrc", { type: type, name: name, room: room }, (status) => {
    console.log(status);
    if (status.message === "success") {
      getSources(room);
    }
  });
}
