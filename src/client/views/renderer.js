import { sources } from "../services/sourceManager";
import { gInvert, blendMode } from "../controller/mixer";

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
