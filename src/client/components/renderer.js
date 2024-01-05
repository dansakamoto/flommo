import { sources } from "../utils/sourceManager";
import * as mixer from "./mixer";

const outputCanvas = document.getElementById("out1");
const outputContext = outputCanvas.getContext("2d");

function mixem() {
  /*
  for (let i = 0; i < sources.length; i++)
    mixer.outAlpha[i] = document.querySelector(`#alpha${i + 1}`).value / 100;

  outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    const id = s.file;
    if (s.type === "video") document.getElementById(s.file).play();
    else if (s.type === "hydra") s.instance.tick(16);

    if (mixer.outOn[i]) {
      outputContext.globalAlpha = mixer.outAlpha[i];
      outputContext.drawImage(
        document.getElementById(id).firstChild,
        0,
        0,
        outputCanvas.offsetWidth,
        outputCanvas.offsetHeight
      );
    }

    if (mixer.gInvert) outputContext.filter = "invert(1)";
    else outputContext.filter = "invert(0)";
    outputContext.globalCompositeOperation = mixer.blendMode;
  }

  */
  /*
  for (const k in sources.vids) document.getElementById(k).play(); // update videos (even if offscreen)
  for (const hi of sources.hydraInstances) {
    hi.tick(16); // update hydra instances
  }
  for (let i = 0; i < sources.numSources; i++)
    mixer.outAlpha[i] = document.querySelector(`#alpha${i + 1}`).value / 100;

  outputContext.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
  let srcNum = 0;

  for (let k in sources.p5s) {
    if (mixer.outOn[srcNum]) {
      outputContext.globalAlpha = mixer.outAlpha[srcNum];
      outputContext.drawImage(
        document.getElementById(k).firstChild,
        0,
        0,
        outputCanvas.offsetWidth,
        outputCanvas.offsetHeight
      );
    }
    srcNum++;
  }

  for (let k in sources.hydras) {
    if (mixer.outOn[srcNum]) {
      outputContext.globalAlpha = mixer.outAlpha[srcNum];
      outputContext.drawImage(
        document.getElementById(k),
        0,
        0,
        outputCanvas.offsetWidth,
        outputCanvas.offsetHeight
      );
    }
    srcNum++;
  }

  for (let k in sources.vids) {
    if (mixer.outOn[srcNum]) {
      outputContext.globalAlpha = mixer.outAlpha[srcNum];
      outputContext.drawImage(
        document.getElementById(k),
        0,
        0,
        outputCanvas.offsetWidth,
        outputCanvas.offsetHeight
      );
    }
    srcNum++;
  }

  if (mixer.gInvert) outputContext.filter = "invert(1)";
  else outputContext.filter = "invert(0)";
  outputContext.globalCompositeOperation = mixer.blendMode;
  */
}
setInterval(mixem, 16); // ~60fps

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
  //document.getElementById("srcPreviews").style.width = `${Math.max(720,720 * Math.floor(window.innerWidth / 720))}px`;
}
resizeRenderer();
window.addEventListener("resize", resizeRenderer);
