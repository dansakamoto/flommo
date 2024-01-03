import "./style.css";
import "./style-editor.css";
import logo from "./FLOMMO_LOGO.png";
import { io } from "socket.io-client";
import { basicSetup, EditorView } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { coolGlow } from "thememirror";
import Hydra from "hydra-synth";
import p5 from "p5";

document.querySelector("#title").innerHTML = `<img
style="width: 300px"
src="${logo}"
alt="Flommo"
/><span style="font-family: 'Courier New', Courier, monospace"
>0.2.0</span
>`;

document.querySelector(
  "#modesmenu"
).innerHTML = `<div class="label">MODES:</div>
  <button id="videobutton" onclick="toggleEditor('video')">
    VIDEO
  </button>
  <button id="hydrabutton" onclick="toggleEditor('hydra')">
    HYDRA
  </button>
  <button id="p5button" onclick="toggleEditor('p5')">P5</button>`;

document.querySelector(
  "#infomenu"
).innerHTML = `<button id="titlebutton" onclick="toggleEditor('title')">
  F 
</button>
<button id="infobutton" onclick="toggleEditor('info')">?</button>`;

document.querySelector("#videoeditor").innerHTML = `<div id="videouploader">
<label for="vidUpload">upload video</label><br />
<input
  type="file"
  size="600px"
  id="vidUpload"
  name="vidUpload"
  onchange="uploadVid(this.files)"
/>
</div>`;

document.querySelector("#blends").innerHTML = `BLENDS:
<input
  type="radio"
  id="source-over"
  name="blendInput"
  value="source-over"
  checked="true"
  onchange="toggleBlend('source-over')"
/>
<label for="source-over">|q| source-over</label>
<input
  type="radio"
  id="screen"
  name="blendInput"
  value="screen"
  onchange="toggleBlend('screen')"
/>
<label for="screen">|w| screen</label>
<input
  type="radio"
  id="multiply"
  name="blendInput"
  value="multiply"
  onchange="toggleBlend('multiply')"
/>
<label for="multiply">|e| multiply</label>
<input
  type="radio"
  id="difference"
  name="blendInput"
  value="difference"
  onchange="toggleBlend('difference')"
/>
<label for="difference">|r| difference</label>`;

document.querySelector("#filters").innerHTML = `FILTERS:
<input
  type="checkbox"
  id="invert"
  name="filterInput"
  value="invert"
  onchange="toggleFilter('invert')"
/>
<label for="invert">|i| invert</label>`;

document.querySelector(
  "#midi"
).innerHTML = `<label for="midion">MIDI listen:</label>
<input
  type="checkbox"
  id="midion"
  name="midion"
  value="midion"
  onchange="toggleMidi()"
/>`;

/*
 *   Migrated from sourcemanager.js
 */
const params = new URLSearchParams(window.location.search);
const room = params.get("room") ? params.get("room") : Date.now();
if (!params.get("room")) history.pushState({}, "", "?room=" + room);

const uploadsDir = "uploads";
const srcWrapper = document.getElementById("srcPreviews");
//const vidWrapper = document.getElementById("loadedVids");
//const p5Wrapper = document.getElementById("loadedP5s");
//const hydraWrapper = document.getElementById("loadedHydras");
const togglePanel = document.getElementById("sourceToggles");
var vids = {},
  hydras = {},
  p5s = {};
var p5Instances = [],
  //  hydraFnctns = [],
  hydraInstances = [];
var numSources = 0;

// SOURCES INIT / REFRESH
function initSources(sourceList) {
  // TO DO - switch dict over to sources, save hydraFnctns inside? rm numSources, rely on sources.length?
  (vids = {}), (hydras = {}), (p5s = {});
  // (hydraFnctns = [])
  (p5Instances = []), (hydraInstances = []);
  numSources = 0;

  // while (vidWrapper.firstChild) vidWrapper.removeChild(vidWrapper.firstChild);
  //while (p5Wrapper.firstChild) p5Wrapper.removeChild(p5Wrapper.firstChild);
  //while (hydraWrapper.firstChild) hydraWrapper.removeChild(hydraWrapper.firstChild);
  while (srcWrapper.firstChild) srcWrapper.removeChild(srcWrapper.firstChild);
  while (togglePanel.firstChild)
    togglePanel.removeChild(togglePanel.firstChild);

  console.log(sourceList);

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
    // const x = numSources;
    closeButton.addEventListener("click", () => {
      delSrc("p", p);
    });

    //p5Wrapper.appendChild(dElement);
    srcWrapper.appendChild(dElement);
    dElement.appendChild(p5Div);
    dElement.appendChild(srcLabel);

    //dElement.appendChild(document.createElement("br"));
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
    //const x = numSources;

    /*
    const hydraInput = document.createElement("textarea");
    const hydraInButton = document.createElement("button");
    hydraInput.id = "hIn"+i;
    hydraInput.rows = 3;
    hydraInput.cols = 60;

    hydraInButton.innerHTML = "Run";
    const j = i
    hydraInButton.addEventListener("click", () => {
      execHydra(j);
    })

    hydraInput.addEventListener("keypress", (e) => {
      if(e.which === 13 && e.shiftKey) {
        e.preventDefault();
        execHydra(j)
      }
    })
    */

    //hydraWrapper.appendChild(dElement);
    srcWrapper.appendChild(dElement);
    dElement.appendChild(hydraCanv);
    dElement.appendChild(srcLabel);

    //dElement.appendChild(document.createElement("br"));
    dElement.appendChild(closeButton);
    dElement.appendChild(document.createElement("br"));
    //dElement.appendChild(hydraInput);
    //dElement.appendChild(hydraInButton);

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
    // const x = numSources;

    //vidWrapper.appendChild(dElement);
    srcWrapper.appendChild(dElement);

    dElement.appendChild(vElement);
    dElement.appendChild(srcLabel);
    //dElement.appendChild(document.createElement("br"));
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

  /*
  if(!sourceList["vids"].length && !sourceList["hydras"].length && !sourceList["p5s"].length){
    document.getElementById("archive").style.display = "block";
  } else {
    document.getElementById("archive").style.display = "none";
  }
  */
}
async function getSources(room) {
  const URL = "/srclist?room=" + room;
  const response = await fetch(URL);
  var data = await response.json();
  initSources(data);
}
getSources(room);

// Socket - source update listener
const socket = io();

/*
socket.on("srcUpdate", function (msg) {
  getSources(room);
});
*/

// SOURCE UPLOAD
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
function uploadP5() {
  //const code = p5Editor.getValue();
  const code = p5Editor.state.doc.toString();
  //const code = document.getElementById("codeUpload").value;
  //document.getElementById("codeUpload").value = "";
  socket.emit("uploadSrc", { room: room, type: "p5", src: code }, (status) => {
    console.log(status);
    if (status.message === "success") {
      getSources(room);
    }
  });
  console.log(code);
}
function uploadHydra() {
  // const code = hydraEditor.getValue();
  const code = hydraEditor.state.doc.toString();
  console.log(code);
  //document.getElementById("codeUpload").value = "";
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
  console.log(code);
}
function uploadCode() {
  if (activeEditor == "hydra") uploadHydra();
  else if (activeEditor == "p5") uploadP5();
  /*
  const jsType = document.querySelector('input[name="codeType"]:checked').value;
  if(jsType === "typeHydra") uploadHydra()
  else uploadP5()
*/
}

//SOURCE DELETE
function delSrc(type, name) {
  socket.emit("delSrc", { type: type, name: name, room: room }, (status) => {
    console.log(status);
    if (status.message === "success") {
      getSources(room);
    }
  });
}

/*
 *   Migrated from controls.js
 */
const outOn = Array(6).fill(false);
const outAlpha = Array(6).fill(1);
var blendMode = "source-over";
var gInvert = false;

// UTILITY FUNCTIONS
window.changeBlend = () => {
  blendMode = document.querySelector("#blendInput").value;
};
window.toggleBlend = (b) => {
  blendMode = b;
};
window.toggleFilter = (f) => {
  if (f === "invert") {
    gInvert = !gInvert;
    document.getElementById("#invert").checked = gInvert;
  }
};
window.toggleSrc = (s) => {
  outOn[s - 1] = document.querySelector(`#on${s}`).checked ? true : false;
  document.querySelector("#welcome").style = "display:none;";
  document.getElementById("nocursor").style.cursor = "none";
};

// MIDI LISTENERS
let midiActive = false;
if ("requestMIDIAccess" in navigator) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}
function onMIDISuccess(midiAccess) {
  const midi = midiAccess;
  const inputs = midi.inputs.values();
  let input = inputs.next();
  while (input.value) {
    input.value.onmidimessage = onMIDIMessage;
    input = inputs.next();
  }
}
function onMIDIFailure(e) {
  console.log("Could not access your MIDI devices: ", e);
}
window.toggleMidi = () => {
  const mSwitch = document.getElementById("midion");
  midiActive = mSwitch.checked;
};
function onMIDIMessage(message) {
  if (!midiActive) return;
  const data = message.data; // [command/channel, note, velocity]
  if (data[0] != 248) console.log(data);
  if (data[0] != 248) {
    //const cmd = data[0];
    const note = data[1];
    const velocity = data[2];
    //if(cmd==midiChannel && velocity==127){
    if (velocity == 127) {
      if (note >= 60 && note <= 69) {
        let n = note - 60;
        outOn[n] = !outOn[n];
        document.querySelector(`#on${n + 1}`).checked = outOn[n];
        //document.querySelector("#welcome").style = "display:none;";
      } else if (note == 70) {
        blendMode = "source-over";
        document.getElementById("source-over").checked = true;
      } else if (note == 71) {
        blendMode = "screen";
        document.getElementById("screen").checked = true;
      } else if (note == 72) {
        blendMode = "multiply";
        document.getElementById("multiply").checked = true;
      } else if (note == 73) {
        blendMode = "difference";
        document.getElementById("difference").checked = true;
      } else if (note == 74) {
        gInvert = !gInvert;
        document.getElementById("invert").checked = gInvert;
      }
    }
  }
}

// KEYBOARD LISTENERS
document.addEventListener(
  "keydown",
  (event) => {
    //if(textAreaActive()) return

    if (event.code == "Space" && event.ctrlKey) {
      window.toggleEditor("hide");
    } else if (event.key >= 0 && event.key <= 9 && event.ctrlKey) {
      event.preventDefault();

      outOn[event.key - 1] = !outOn[event.key - 1];
      document.querySelector(`#on${event.key}`).checked = outOn[event.key - 1];
      //document.querySelector("#welcome").style = "display:none;";
      document.getElementById("nocursor").style.cursor = "none";
    } else if (event.key == "q" && event.ctrlKey) {
      blendMode = "source-over";
      document.getElementById("source-over").checked = true;
    } else if (event.key == "w" && event.ctrlKey) {
      blendMode = "screen";
      document.getElementById("screen").checked = true;
    } else if (event.key == "e" && event.ctrlKey) {
      blendMode = "multiply";
      document.getElementById("multiply").checked = true;
    } else if (event.key == "r" && event.ctrlKey) {
      blendMode = "difference";
      document.getElementById("difference").checked = true;
    } else if (event.key == "b" && event.ctrlKey) {
      document.querySelector("#welcome").style = "display:none;";
      document.getElementById("nocursor").style.cursor = "none";
      for (let i = 0; i < numSources; i++) {
        outOn[i] = false;
        document.querySelector(`#on${i + 1}`).checked = false;
      }
    } else if (event.key == "i" && event.ctrlKey) {
      gInvert = !gInvert;
      document.getElementById("invert").checked = gInvert;
    } else if (event.key == "z" && event.ctrlKey) {
      window.toggleEditor("video");
    } else if (event.key == "x" && event.ctrlKey) {
      window.toggleEditor("hydra");
    } else if (event.key == "c" && event.ctrlKey) {
      window.toggleEditor("p5");
    } else if (event.key == "/" && event.ctrlKey) {
      window.toggleEditor("info");
    } else if (event.key == "." && event.ctrlKey) {
      window.toggleEditor("title");
    }
  },
  false
);

/*
 *   Migrated from renderer.js
 */
const OCANVAS = document.getElementById("out1");
const OCONTEXT = OCANVAS.getContext("2d");

function mixem() {
  // make sure all sources update
  for (let k in vids) document.getElementById(k).play(); // update videos (even if offscreen)
  for (const hi of hydraInstances) {
    hi.tick(16);
  } // update hydra instances
  for (let i = 0; i < numSources; i++)
    outAlpha[i] = document.querySelector(`#alpha${i + 1}`).value / 100; // update alpha levels

  OCONTEXT.clearRect(0, 0, OCANVAS.width, OCANVAS.height);
  let srcNum = 0;

  for (let k in p5s) {
    if (outOn[srcNum]) {
      OCONTEXT.globalAlpha = outAlpha[srcNum];
      OCONTEXT.drawImage(
        document.getElementById(k).firstChild,
        0,
        0,
        OCANVAS.offsetWidth,
        OCANVAS.offsetHeight
      );
    }
    srcNum++;
  }

  for (let k in hydras) {
    if (outOn[srcNum]) {
      OCONTEXT.globalAlpha = outAlpha[srcNum];
      OCONTEXT.drawImage(
        document.getElementById(k),
        0,
        0,
        OCANVAS.offsetWidth,
        OCANVAS.offsetHeight
      );
    }
    srcNum++;
  }

  for (let k in vids) {
    if (outOn[srcNum]) {
      OCONTEXT.globalAlpha = outAlpha[srcNum];
      OCONTEXT.drawImage(
        document.getElementById(k),
        0,
        0,
        OCANVAS.offsetWidth,
        OCANVAS.offsetHeight
      );
    }
    srcNum++;
  }

  if (gInvert) OCONTEXT.filter = "invert(1)";
  else OCONTEXT.filter = "invert(0)";
  OCONTEXT.globalCompositeOperation = blendMode;
}
setInterval(mixem, 16); // ~60fps

function resizeRenderer() {
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

/*
 *   Migrated from editor.js
 */
var activeEditor = "info";

let language = new Compartment(),
  tabSize = new Compartment();

let hydraEditorState = EditorState.create({
  doc: "osc().out()",
  extensions: [
    basicSetup,
    language.of(javascript()),
    tabSize.of(EditorState.tabSize.of(2)),
    coolGlow,
  ],
});

var hydraEditor = new EditorView({
  parent: document.querySelector("#hydraeditor"),
  extensions: [javascript()],
  state: hydraEditorState,
});

let p5EditorState = EditorState.create({
  doc: "// running in instance mode - functions must start with f.\n\nf.setup = () => {\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}",
  extensions: [
    basicSetup,
    language.of(javascript()),
    tabSize.of(EditorState.tabSize.of(2)),
    coolGlow,
  ],
});

var p5Editor = new EditorView({
  parent: document.querySelector("#p5editor"),
  extensions: [javascript()],
  state: p5EditorState,
  lineNumbers: true,
  tabSize: 2,
});

// Code upload listener (deprecated - non-codemirror textarea version)
/*
document.getElementById("codeUpload").addEventListener("keypress", (e) => {
  if(e.which === 13 && e.shiftKey) {
    e.preventDefault();
    uploadCode();
  }
})
*/

// Keyboard commands
document.getElementById("hydraeditor").addEventListener("keypress", (e) => {
  if (e.which === 13 && e.ctrlKey) {
    e.preventDefault();
    uploadCode();
  } /* else if (e.which === 13 && e.ctrlKey) {
    e.preventDefault();
    const index = 0;
    const code = hydraEditor.getValue();
    console.log(code);
    eval("hydraInstances[" + index + "]." + code);
  } */
});

// Keyboard commands
document.getElementById("p5editor").addEventListener("keypress", (e) => {
  if (e.which === 13 && e.ctrlKey) {
    e.preventDefault();
    uploadCode();
  }
});

/*
function textAreaActive() {
  // boolean check
  const a = document.activeElement.tagName;
  return a.toLowerCase() === "textarea";
}
*/

// Deprecated? More streamlined if all code execution is autosaved?
/*
function execHydra(index) {
  console.log("execHydra: " + index);
  const code = document.getElementById("hIn" + index).value;
  eval("hydraInstances[" + index + "]." + code);
}
*/

function resizeEditor() {
  const editorHeight =
    window.innerHeight - document.getElementById("menu").offsetHeight;
  let editors = document.querySelectorAll(".cm-editor");
  for (let e of editors) {
    e.style.height = editorHeight + "px";
  }
  document.querySelector("#videoeditor").style.height = editorHeight + "px";
}
resizeEditor();
window.addEventListener("resize", resizeEditor);

window.toggleEditor = (active) => {
  if (active == activeEditor) {
    activeEditor = "none";

    document.querySelector("#menu").style = "diplay:flex";
    document.querySelector("#hydraeditor").style = "display:none;";
    document.querySelector("#p5editor").style = "display:none;";
    document.querySelector("#videoeditor").style = "display:none;";
    document.querySelector("#nocursor").style = "display:none;";
    document.querySelector("#manual").style = "display:none;";
    document.querySelector("#empty").style = "display:block;";

    document.querySelector("#hydrabutton").classList.remove("active");
    document.querySelector("#p5button").classList.remove("active");
    document.querySelector("#videobutton").classList.remove("active");
    document.querySelector("#infobutton").classList.remove("active");
    document.querySelector("#titlebutton").classList.remove("active");

    resizeRenderer();

    return;
  }

  switch (active) {
    case "video":
      activeEditor = "video";
      document.querySelector("#menu").style = "diplay:flex";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:flex;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.remove("active");
      document.querySelector("#p5button").classList.remove("active");
      document.querySelector("#videobutton").classList.add("active");
      document.querySelector("#infobutton").classList.remove("active");
      document.querySelector("#titlebutton").classList.remove("active");
      resizeEditor();
      break;
    case "p5":
      activeEditor = "p5";
      document.querySelector("#menu").style = "diplay:flex";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:block;";
      document.querySelector("#videoeditor").style = "display:none;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.remove("active");
      document.querySelector("#p5button").classList.add("active");
      document.querySelector("#videobutton").classList.remove("active");
      document.querySelector("#infobutton").classList.remove("active");
      document.querySelector("#titlebutton").classList.remove("active");
      resizeEditor();
      break;
    case "hydra":
      activeEditor = "hydra";
      document.querySelector("#menu").style = "diplay:flex";
      document.querySelector("#hydraeditor").style = "display:block;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:none;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.add("active");
      document.querySelector("#p5button").classList.remove("active");
      document.querySelector("#videobutton").classList.remove("active");
      document.querySelector("#infobutton").classList.remove("active");
      document.querySelector("#titlebutton").classList.remove("active");
      resizeEditor();
      break;
    case "info":
      activeEditor = "info";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:none;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:flex;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.remove("active");
      document.querySelector("#p5button").classList.remove("active");
      document.querySelector("#videobutton").classList.remove("active");
      document.querySelector("#infobutton").classList.add("active");
      document.querySelector("#titlebutton").classList.remove("active");
      resizeRenderer();
      break;
    case "title":
      activeEditor = "title";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:none;";
      document.querySelector("#nocursor").style = "display:flex;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.remove("active");
      document.querySelector("#p5button").classList.remove("active");
      document.querySelector("#videobutton").classList.remove("active");
      document.querySelector("#infobutton").classList.remove("active");
      document.querySelector("#titlebutton").classList.add("active");
      resizeRenderer();
      break;
    case "hide":
      if (document.querySelector("#hud").style.visibility == "hidden") {
        document.querySelector("#hud").style = "visibility:visible";
        document.querySelector("#interface").style.cursor = "auto";
      } else {
        document.querySelector("#hud").style = "visibility:hidden";
        document.querySelector("#interface").style.cursor = "none";
      }
  }
};
window.toggleEditor("title");
