import "./renderer.css";
import Hydra from "hydra-synth";
import p5 from "p5";
import session from "../session";
import { delSrc } from "../services/data";
import { toggleSrc, updateAlpha } from "./mixerListeners";

setInterval(drawRenderer, 16); // ~60fps
window.addEventListener("resize", resizeRenderer);

export function resizeRenderer() {
  document.getElementById("out1").width = window.innerWidth;
  document.getElementById("out1").height = window.innerHeight;

  const menuHeight = document.getElementById("menu").offsetHeight;
  const noCursorHeight = window.innerHeight - menuHeight;
  document.getElementById("welcome-panel").style.height = noCursorHeight + "px";
  document.getElementById("manual").style.height = noCursorHeight + "px";
  document.getElementById("welcome").style.top = "-" + menuHeight + "px";
  document.getElementById("m2").style.top = "-" + menuHeight + "px";
  document.getElementById("empty").style.height = noCursorHeight + "px";
}

export function updateRenderer(type = "hard-refresh") {
  const srcWrapper = document.getElementById("srcPreviews");

  let first = 0;

  if (type === "hard-refresh") {
    while (srcWrapper.firstChild) srcWrapper.removeChild(srcWrapper.firstChild);
    first = 0;
  } else if (type === "add") {
    first = session.sources.length - 1;
  }

  for (let i = first; i < session.sources.length; i++) {
    const s = session.sources[i];

    //const containerName = "srcCanvas" + i;
    const containerName = "srcCanvas" + s.id;

    const inputDiv = document.createElement("div");
    inputDiv.classList.add("inputDiv");
    inputDiv.id = "inputDiv" + i;
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

    if (s.type === "p5") {
      session.sources[i]["instance"] = new p5(
        Function("f", s.data),
        containerName
      );
    } else if (s.type === "hydra") {
      const hydraDestructurer =
        "const { src, osc, gradient, shape, voronoi, noise, s0, s1, s2, s3, o0, o1, o2, o3, render } = f;";
      session.sources[i]["instance"] = new Hydra({
        makeGlobal: false,
        canvas: document.getElementById(containerName),
        detectAudio: false,
        autoLoop: false,
      }).synth;
      const hFunc = Function("f", hydraDestructurer + s.data);
      hFunc(session.sources[i].instance);
    }
  }
}

export function updateSingleRenderer(id = -1) {
  let index = -1;
  for (let i = 0; i < session.sources.length; i++) {
    if (session.sources[i].id === id) {
      index = i;
      break;
    }
  }
  const s = session.sources[index];
  //const containerName = "srcCanvas" + index;
  const containerName = "srcCanvas" + id;

  if (s.type === "p5") {
    const container = document.getElementById(containerName);
    container.removeChild(container.firstChild);
    s["instance"] = new p5(Function("f", s.data), containerName);
  } else if (s.type === "hydra") {
    const hydraDestructurer =
      "const { src, osc, gradient, shape, voronoi, noise, s0, s1, s2, s3, o0, o1, o2, o3, render } = f;";
    const hFunc = Function("f", hydraDestructurer + s.data);
    hFunc(s.instance);
  } else if (s.type === "video") {
    document.getElementById(containerName).src = s.data;
  }
}

export function deleteSingleRenderer(panelNum = -1) {
  const srcWrapper = document.getElementById("srcPreviews");
  var target = srcWrapper.children.item(panelNum);
  srcWrapper.removeChild(target);
  shiftRendererIDs();
}

function shiftRendererIDs() {
  const srcWrapper = document.getElementById("srcPreviews");
  let i = 0;
  srcWrapper.childNodes.forEach((child) => {
    child.id = "inputDiv" + i;
    //const inputSrc = child.querySelector(".inputSrc");
    //inputSrc.id = "inputSrc" + i;
    const srcLabel = child.querySelector(".srcLabel");
    srcLabel.innerHTML = `${i + 1}`;
    const panel = child.querySelector(".panel");
    const srcToggle = panel.querySelector(".srcToggle");
    srcToggle.id = `on${i + 1}`;
    srcToggle.setAttribute("name", `on${i + 1}`);
    srcToggle.setAttribute("value", `on${i + 1}`);
    const label = panel.querySelector(".label");
    label.setAttribute("for", `on${i + 1}`);
    label.innerHTML = `Send ${i + 1}`;
    const slider = panel.querySelector(".slider");
    slider.id = `alpha${i + 1}`;

    srcToggle.i = i;
    srcToggle.onchange = () => {
      toggleSrc(srcToggle.i);
    };
    slider.onpointermove = () => {
      updateAlpha(srcToggle.i);
    };

    i++;
  });

  // inside div id=srcPreviews
  //    each child gets new sequential id=inputDiv[n]
  //      canvas OR div OR video of class=inputSrc inside gets new id=srcCanvas[n]
  //      div of class=srcLabel inside gets new inner text [n+1]
}

function drawRenderer() {
  const outputCanvas = document.getElementById("out1");
  const outputContext = outputCanvas.getContext("2d");
  outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

  for (let i = 0; i < session.sources.length; i++) {
    const s = session.sources[i];

    //const id = "srcCanvas" + i;
    const id = "srcCanvas" + s.id;

    if (s.type === "video") document.getElementById(id).play();
    else if (s.type === "hydra" && s.instance) s.instance.tick(16);

    if (s.active && document.getElementById(id) !== null) {
      outputContext.globalAlpha = s.alpha;
      const srcElement =
        s.type === "p5"
          ? document.getElementById(id).firstChild
          : document.getElementById(id);

      if (srcElement !== null) {
        outputContext.drawImage(
          srcElement,
          0,
          0,
          outputCanvas.offsetWidth,
          outputCanvas.offsetHeight
        );
      }
    }

    if (session.globalInvert) outputContext.filter = "invert(1)";
    else outputContext.filter = "invert(0)";

    outputContext.globalCompositeOperation = session.blendMode;
  }
}
