import Hydra from "hydra-synth";
import p5 from "p5";
import { io } from "socket.io-client";
import { refreshToggles } from "../components/mixer";
import { refreshSrcButtons } from "../components/uiController";

const socket = io();
const srcWrapper = document.getElementById("srcPreviews");
const videoUploader = document.querySelector("#videouploader");
const params = new URLSearchParams(window.location.search);
const room = params.get("room") ? params.get("room") : Date.now();
if (!params.get("room")) history.pushState({}, "", "?room=" + room);

fetchSources(room);

videoUploader.onsubmit = (e) => {
  e.preventDefault();
  uploadVid(e.target.elements.vidUpload.value);
  document.querySelector("#vidUpload").value = "";
};

export var sources = [];

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

function uploadVid(url) {
  socket.emit(
    "uploadSrc",
    { room: room, type: "video", src: url },
    (status) => {
      if (status.message === "success") fetchSources(room);
    }
  );
}

function delSrc(id) {
  socket.emit("delSrc", { id: id }, (status) => {
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

  sources = sourceList;

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];

    sources[i]["alpha"] = s.alpha;
    sources[i]["active"] = s.active;

    const containerName = "srcCanvas" + i;
    const inputDiv = document.createElement("div");
    inputDiv.classList.add("inputDiv");
    const srcLabel = document.createElement("div");
    srcLabel.classList.add("srcLabel");
    srcLabel.innerHTML = i + 1;
    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.innerHTML = "X";
    closeButton.addEventListener("click", () => {
      delSrc(s.id);
    });

    let srcContainer;
    if (s.type === "p5") {
      srcContainer = document.createElement("div");
    } else if (s.type === "hydra") {
      srcContainer = document.createElement("canvas");
    } else if (s.type === "video") {
      srcContainer = document.createElement("video");
      srcContainer.src = s.data;
      srcContainer.loop = true;
      srcContainer.autoplay = true;
      srcContainer.muted = true;
    }
    srcContainer.width = 720;
    srcContainer.height = 400;
    srcContainer.id = containerName;
    srcContainer.classList.add("inputSrc");

    srcWrapper.appendChild(inputDiv);
    inputDiv.appendChild(srcContainer);
    inputDiv.appendChild(srcLabel);
    inputDiv.appendChild(closeButton);

    const canvasID = containerName;
    if (s.type === "p5") {
      sources[i]["instance"] = new p5(Function("f", s.data), canvasID);
    } else if (s.type === "hydra") {
      const hydraDestructurer =
        "const { src, osc, gradient, shape, voronoi, noise, s0, s1, s2, s3, o0, o1, o2, o3, render } = f;";
      sources[i]["instance"] = new Hydra({
        makeGlobal: false,
        canvas: document.getElementById(canvasID),
        detectAudio: false,
        autoLoop: false,
      }).synth;
      const hFunc = Function("f", hydraDestructurer + s.data);
      hFunc(sources[i].instance);
    }
  }

  refreshToggles();
  refreshSrcButtons();
}
