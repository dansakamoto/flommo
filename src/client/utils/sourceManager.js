import Hydra from "hydra-synth";
import p5 from "p5";
import { io } from "socket.io-client";
import { refreshToggles } from "../components/mixer";

const socket = io();
const uploadsDir = "uploads";
const srcWrapper = document.getElementById("srcPreviews");
const videoUploader = document.querySelector("#vidUpload");
const params = new URLSearchParams(window.location.search);
const room = params.get("room") ? params.get("room") : Date.now();
if (!params.get("room")) history.pushState({}, "", "?room=" + room);

fetchSources(room);
videoUploader.onchange = () => {
  console.log(videoUploader);
  uploadVid(videoUploader.files);
};

export const sources = [];

export function uploadP5(code) {
  socket.emit("uploadSrc", { room: room, type: "p5", src: code }, (status) => {
    if (status.message === "success") fetchSources(room);
  });
}

export function uploadHydra(code) {
  socket.emit(
    "uploadSrc",
    { room: room, type: "hydra", src: code },
    (status) => {
      if (status.message === "success") fetchSources(room);
    }
  );
}

function uploadVid(files) {
  socket.emit(
    "uploadSrc",
    { room: room, name: files[0].name, type: "vid", data: files[0] },
    (status) => {
      console.log(status);
      if (status.message === "success") fetchSources(room);
    }
  );
}

function delSrc(type, name) {
  socket.emit("delSrc", { type: type, name: name, room: room }, (status) => {
    if (status.message === "success") fetchSources(room);
  });
}

async function fetchSources(room) {
  const URL = "/srclist?room=" + room;
  const response = await fetch(URL);
  var data = await response.json();
  refreshSources(data);
}

function refreshSources(sourceList) {
  sources.length = 0;
  while (srcWrapper.firstChild) srcWrapper.removeChild(srcWrapper.firstChild);
  for (const file of sourceList["p5"]) sources.push({ type: "p5", file: file });
  for (const file of sourceList["hydra"])
    sources.push({ type: "hydra", file: file });
  for (const file of sourceList["vid"])
    sources.push({ type: "video", file: file });

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];

    if (s.type !== "hydra" || s.type !== "p5") {
      const scriptElement = document.createElement("script");
      scriptElement.src = `${uploadsDir}/${room}/${s.type}/${s.file}`;
      scriptElement.async = true;
      scriptElement.f = s.file;
      scriptElement.i = i;
      scriptElement.t = s.type;
      scriptElement.onload = function () {
        console.log("running onload");
        const loc = this.f.substring(0, this.f.lastIndexOf("."));
        const canvasID = "srcCanvas" + this.i;

        if (this.t === "p5") {
          sources[this.i]["instance"] = new p5(window[loc], canvasID);
        } else if (this.t === "hydra") {
          sources[this.i]["instance"] = new Hydra({
            makeGlobal: false,
            canvas: document.getElementById(canvasID),
            detectAudio: false,
            autoLoop: false,
          }).synth;
          console.log("running inner script");
          console.log("this.i = " + this.i);
          console.log("sources = ");
          console.log(sources);
          window[loc](sources[this.i].instance);
        }
      };
      document.body.appendChild(scriptElement);
    }

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("inputDiv");
    const srcLabel = document.createElement("div");
    srcLabel.classList.add("srcLabel");
    srcLabel.innerHTML = i + 1;
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.innerHTML = "X";
    closeButton.addEventListener("click", () => {
      delSrc(s.type, s.file);
    });

    let srcContainer;
    if (s.type === "p5") {
      srcContainer = document.createElement("div");
    } else if (s.type === "hydra") {
      srcContainer = document.createElement("canvas");
    } else if (s.type === "video") {
      srcContainer = document.createElement("video");
      srcContainer.src = `${window.location.origin}/${uploadsDir}/${room}/vids/${s.file}`;
      srcContainer.loop = true;
      srcContainer.autoplay = true;
      srcContainer.muted = true;
    }
    srcContainer.width = 720;
    srcContainer.height = 400;
    srcContainer.id = "srcCanvas" + i;
    srcContainer.classList.add("inputSrc");

    srcWrapper.appendChild(inputDiv);
    inputDiv.appendChild(srcContainer);
    inputDiv.appendChild(srcLabel);
    inputDiv.appendChild(closeButton);
  }

  refreshToggles();
}
