import Hydra from "hydra-synth";
import p5 from "p5";
import { sources } from "../models/sources";
import { gInvert, blendMode } from "../models/mixer";
import { delSrc } from "../services/data";

const srcWrapper = document.getElementById("srcPreviews");
const outputCanvas = document.getElementById("out1");
const outputContext = outputCanvas.getContext("2d");

setInterval(mixem, 16); // ~60fps
resizeRenderer();
window.addEventListener("resize", resizeRenderer);

function mixem() {
  outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    const id = "srcCanvas" + i;
    if (s.type === "video") document.getElementById(id).play();
    else if (s.type === "hydra") s.instance.tick(16);

    if (s.active) {
      outputContext.globalAlpha = s.alpha;
      const srcElement =
        s.type === "p5"
          ? document.getElementById(id).firstChild
          : document.getElementById(id);
      outputContext.drawImage(
        srcElement,
        0,
        0,
        outputCanvas.offsetWidth,
        outputCanvas.offsetHeight
      );
    }

    if (gInvert) outputContext.filter = "invert(1)";
    else outputContext.filter = "invert(0)";
    outputContext.globalCompositeOperation = blendMode;
  }
}

export function resizeRenderer() {
  const menuHeight = document.getElementById("menu").offsetHeight;
  const noCursorHeight = window.innerHeight - menuHeight;

  document.getElementById("out1").width = window.innerWidth;
  document.getElementById("out1").height = window.innerHeight;
  document.getElementById("nocursor").style.height = noCursorHeight + "px";
  document.getElementById("manual").style.height = noCursorHeight + "px";
  document.getElementById("welcome").style.top = "-" + menuHeight + "px";
  document.getElementById("m2").style.top = "-" + menuHeight + "px";
  document.getElementById("empty").style.height = noCursorHeight + "px";
}

export function updateOutputs() {
  while (srcWrapper.firstChild) srcWrapper.removeChild(srcWrapper.firstChild);

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
}
