const params= new URLSearchParams(window.location.search);
const ROOM = (params.get("room")) ? params.get("room") : Date.now();
if(!params.get("room")) history.pushState({},"","?room="+ROOM)

const vidWrapper = document.getElementById("loadedVids");
const p5Wrapper = document.getElementById("loadedP5s");
const hydraWrapper = document.getElementById("loadedHydras");
const togglePanel = document.getElementById("sourceToggles");
var vids = {}, hydras = {}, p5s = {};
var p5Instances = [], hydraFnctns = [], hydraInstances = [];
var numSources = 0;

/*
* SOURCE MANAGERS
*/
function initSources(sourceList){

  vids = {}, hydras = {}, p5s = {};
  p5Instances = [], hydraFnctns = [], hydraInstances = [];
  numSources = 0;

  while (vidWrapper.firstChild) {
    vidWrapper.removeChild(vidWrapper.firstChild);
  }
  while (p5Wrapper.firstChild) {
    p5Wrapper.removeChild(p5Wrapper.firstChild);
  }
  while (hydraWrapper.firstChild) {
    hydraWrapper.removeChild(hydraWrapper.firstChild);
  }
  while (togglePanel.firstChild) {
    togglePanel.removeChild(togglePanel.firstChild);
  }

  var i=0;
  for(p of sourceList["p5s"]){

    const scriptElement = document.createElement("script");
    scriptElement.src = "sources/"+ROOM+"/p5/" + p;
    scriptElement.async = true;

    scriptElement.p = p;
    scriptElement.i = i;

    scriptElement.onload = function() {
      var loc = this.p.substring(0,this.p.lastIndexOf('.'));
      var canvasID = "p5Canvas"+this.i;
      p5Instances.push(new p5(window[loc], canvasID ));
    }
    document.body.appendChild(scriptElement);

    const dElement = document.createElement("div");
    dElement.classList.add("inputDiv");

    const srcLabel = document.createElement("div");
    dElement.classList.add("srcLabel");
    dElement.innerHTML = numSources+1;

    const p5Div = document.createElement("div");
    p5Div.id = "p5Canvas"+i;
    p5Div.classList.add("inputSrc");

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.innerHTML = "X";
    const x = numSources;
    closeButton.addEventListener("click", () => {delSrc("p",p)});


    p5Wrapper.appendChild(dElement);
    dElement.appendChild(srcLabel);
    dElement.appendChild(p5Div);
    dElement.appendChild(document.createElement("br"));
    dElement.appendChild(closeButton);

    p5s["p5Canvas"+i] = p;
    i++;
    numSources++;
  }

  var i=0;
  for(h of sourceList["hydras"]){

    const scriptElement = document.createElement("script");
    scriptElement.src = "sources/"+ROOM+"/hydra/" + h;
    scriptElement.async = true;

    scriptElement.h = h;
    scriptElement.i = i;

    scriptElement.onload = function() {
      var loc = this.h.substring(0,this.h.lastIndexOf('.'));
      var canvasID = "hydraCanvas"+this.i;

      console.log(window[loc]);

      hydraInstances.push(new Hydra({
        makeGlobal: false,
        canvas: document.getElementById(canvasID),
        detectAudio: false,
        autoLoop: false
      }).synth);

      window[loc](hydraInstances[this.i]);

    }
    document.body.appendChild(scriptElement);

    const dElement = document.createElement("div");
    dElement.classList.add("inputDiv");

    const srcLabel = document.createElement("div");
    dElement.classList.add("srcLabel");
    dElement.innerHTML = numSources+1;

    const hydraCanv = document.createElement("canvas");
    hydraCanv.id = "hydraCanvas"+i;
    hydraCanv.classList.add("inputSrc");
    hydraCanv.width = 720;
    hydraCanv.height = 400;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.innerHTML = "X";
    const x = numSources;

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

    hydraWrapper.appendChild(dElement);
    dElement.appendChild(srcLabel);
    dElement.appendChild(hydraCanv);
    dElement.appendChild(document.createElement("br"));
    dElement.appendChild(closeButton);
    dElement.appendChild(document.createElement("br"));
    dElement.appendChild(hydraInput);
    dElement.appendChild(hydraInButton);

    closeButton.addEventListener("click", () => {delSrc("h", h)});

    hydras["hydraCanvas"+i] = h;
    i++;
    numSources++;
  }

  var i=0;
  for(v of sourceList["vids"]){
    const dElement = document.createElement("div");
    dElement.classList.add("inputDiv");

    const srcLabel = document.createElement("div");
    dElement.classList.add("srcLabel");
    dElement.innerHTML = numSources+1;

    const vElement = document.createElement("video");
    vElement.src = window.location.origin + "/sources/"+ROOM+"/vids/" + v;
    vElement.classList.add("inputSrc");
    vElement.id = "video"+i;
    vElement.width = 720;
    vElement.height = 400;
    vElement.loop = true;
    vElement.autoplay = true;
    vElement.muted = true;

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.innerHTML = "X";
    const x = numSources;

    vidWrapper.appendChild(dElement);
    dElement.appendChild(srcLabel);
    dElement.appendChild(vElement);
    dElement.appendChild(document.createElement("br"));
    dElement.appendChild(closeButton);

    closeButton.addEventListener("click", () => {delSrc('v',v)});

    vids["video"+i] = v;
    i++;
    numSources++;
  }

  for(let j=0; j<numSources; j++){
    const panelDiv = document.createElement("div");
    panelDiv.classList.add("panel");
    panelDiv.innerHTML = `<input type="checkbox" id="on${j+1}" name="on${j+1}" value="on${j+1}" onchange="toggleSrc(${j+1})"><label for="on${j+1}">Send ${j+1}</label><br><input type="range" min="0" max="100" value="100" class="slider" id="alpha${j+1}"><br></br>`;

    togglePanel.appendChild(panelDiv);
  }

  if(!sourceList["vids"].length && !sourceList["hydras"].length && !sourceList["p5s"].length){
    document.getElementById("archive").style.display = "block";
  } else {
    document.getElementById("archive").style.display = "none";
  }

}
async function getSources(room){
  const URL = "/srclist?room=" + room;
  const response = await fetch(URL);
  var data = await response.json();
  initSources(data);
}
getSources(ROOM);

// Source uploaders
function uploadVid(files) {
  console.log(files[0])

  const status = socket.emit("uploadVid", { room:ROOM, name: files[0].name, data: files[0] }, (status) => {
    console.log(status);
    if(status.message === "success"){
      getSources(ROOM);
    }
  })
}
function uploadCode() {
  const jsType = document.querySelector('input[name="codeType"]:checked').value;
  if(jsType === "typeHydra") uploadHydra()
  else uploadP5()
}
function uploadP5() {
  const code = document.getElementById("codeUpload").value;
  document.getElementById("codeUpload").value = "";

  socket.emit("uploadP5", {room:ROOM, src:code}, (status) => {
    console.log(status);
    if(status.message === "success"){
      getSources(ROOM);
    }
  })
  console.log(code);
}
function uploadHydra() {
  const code = cmEditor.getValue();
  document.getElementById("codeUpload").value = "";

  socket.emit("uploadHydra", {room:ROOM,src:code}, (status) => {
    console.log(status);
    if(status.message === "success"){
      getSources(ROOM);
    }
  })
  console.log(code)
}

// Delete a source
function delSrc(type,name){
  socket.emit("delSrc", {type:type, name:name, room:ROOM}, (status) => {
    console.log(status);
    if(status.message === "success"){
      getSources(ROOM);
    }
  })
}

// Socket - source update listener
const socket = io();
socket.on('srcUpdate', function(msg) {
  getSources(ROOM);
})

/*
* MIXER
*/
const outOn = Array(6).fill(false);
const outAlpha = Array(6).fill(1);
var blendMode = "source-over";
var gInvert = false;

function changeBlend() {
  blendMode = document.querySelector("#blendInput").value;
}

function toggleBlend(b){
  blendMode = b;
}

function toggleFilter(f){
  gInvert = !gInvert;
  document.getElementById("#invert").checked = gInvert;
}

// Main renderer
function mixem() {

  var out1 = document.getElementById("out1");
  var ctxo1 = out1.getContext('2d');

  // update videos (even if offscreen)
  for(let k in vids) document.getElementById(k).play();

  // update alphas
  for(let i=0; i<numSources; i++) outAlpha[i] = document.querySelector(`#alpha${i+1}`).value/100;

  ctxo1.clearRect(0, 0, out1.width, out1.height);

  for(hi of hydraInstances){
    hi.tick(16);
  }

  let i = 0;
  for(let k in p5s){
    if(outOn[i]){
      ctxo1.globalAlpha = outAlpha[i];
      ctxo1.drawImage(document.getElementById(k).firstChild,0,0, out1.offsetWidth, out1.offsetHeight);
    }
    i++;
  }

  for(let k in hydras){
    if(outOn[i]){
      ctxo1.globalAlpha = outAlpha[i];
      ctxo1.drawImage(document.getElementById(k),0,0, out1.offsetWidth, out1.offsetHeight);
    }
    i++;
  }

  for(let k in vids){
    if(outOn[i]){
      ctxo1.globalAlpha = outAlpha[i];
      ctxo1.drawImage(document.getElementById(k),0,0, out1.offsetWidth, out1.offsetHeight);
    }
    i++;
  }

  if(gInvert) ctxo1.filter = 'invert(1)'
  else ctxo1.filter = 'invert(0)'
  ctxo1.globalCompositeOperation = blendMode;

}
var t=setInterval(mixem,16);

/*
* MIXER CONTROLS
*/

// GUI listeners
function toggleSrc(s){
  outOn[s-1] = (document.querySelector(`#on${s}`).checked) ? true : false;
  document.querySelector("#welcome").style = "display:none;";
  document.getElementById("nocursor").style.cursor = "none";
}

// MIDI listeners
if ('requestMIDIAccess' in navigator) {
  navigator.requestMIDIAccess()
    .then(onMIDISuccess, onMIDIFailure);
}
function onMIDISuccess(midiAccess) {
const midi = midiAccess
const inputs = midi.inputs.values()
const input = inputs.next()
console.log(input)
input.value.onmidimessage = onMIDIMessage
}
function onMIDIFailure(e) {
  console.log('Could not access your MIDI devices: ', e)
}
function onMIDIMessage(message) {
  const data = message.data // [command/channel, note, velocity]
  if (data[0] != 248) console.log(data);
  if (data[0] != 248){
    const cmd = data[0];
    const note = data[1];
    const velocity = data[2];
    //152 keyboard, 144 ableton
    if(cmd==144 && velocity==127){
      if(note >= 60 && note <= 69){
        n = note-60;
        outOn[n] = !(outOn[n]);
        document.querySelector(`#on${n+1}`).checked = outOn[n];
        document.querySelector("#welcome").style = "display:none;";
      }
      else if(note==70){
        blendMode = "source-over"
        document.getElementById("source-over").checked = true;
      }
      else if(note==71){
        blendMode = "screen"
        document.getElementById("screen").checked = true;
      }
      else if(note==72){
        blendMode = "multiply"
        document.getElementById("multiply").checked = true;
      }
      else if(note==73){
        blendMode = "difference"
        document.getElementById("difference").checked = true;
      }
      else if(note==74){
        gInvert = !gInvert;
        document.getElementById("invert").checked = gInvert;
      }
    }
  }
}

// Keyboard listeners
document.addEventListener('keydown', (event) => {

  if(textAreaActive()) return

  if(event.key >= 0 && event.key <=  9){
    event.preventDefault();

    outOn[event.key-1] = !(outOn[event.key-1]);
    document.querySelector(`#on${event.key}`).checked = outOn[event.key-1];
    document.querySelector("#welcome").style = "display:none;";
    document.getElementById("nocursor").style.cursor = "none"
  }
  else if(event.key == 'q'){
    blendMode = "source-over"
    document.getElementById("source-over").checked = true;
  }
  else if(event.key == 'w'){
    blendMode = "screen"
    document.getElementById("screen").checked = true;
  }
  else if(event.key == 'e'){
    blendMode = "multiply"
    document.getElementById("multiply").checked = true;
  }
  else if(event.key == 'r'){
    blendMode = "difference"
    document.getElementById("difference").checked = true;
  }
  else if(event.key == 'b'){
    document.querySelector("#welcome").style = "display:none;";
    document.getElementById("nocursor").style.cursor = "none"
    for(let i=0; i<numSources; i++){
      outOn[i] = false;
      document.querySelector(`#on${i+1}`).checked = false;
    }
  }
  else if(event.key == 'i'){
    gInvert = !gInvert;
    document.getElementById("invert").checked = gInvert;
  }
}, false);

/*
* LIVE CODE EDITOR
*/

// Initialize
var cmEditor = CodeMirror(document.querySelector('#editor'), {
  lineNumbers: true,
  tabSize: 2,
  value: 'f.'
});

// Code upload listener
document.getElementById("codeUpload").addEventListener("keypress", (e) => {
  if(e.which === 13 && e.shiftKey) {
    e.preventDefault();
    uploadCode();
  }
})

// Code editor keyboard shortcuts
document.getElementById("editor").addEventListener("keypress", (e) => {
  if(e.which === 13 && e.shiftKey) {
    e.preventDefault();
    uploadCode();
  } else if(e.which === 13 && e.ctrlKey) {
    e.preventDefault()
    const index = 0;
    const code = cmEditor.getValue();
    console.log(code)
    eval("hydraInstances[" + index + "]." + code)
  }
})

/*
* UTILS / MISC
*/

// Utility - return name of active textArea
function textAreaActive() {
  const a = document.activeElement.tagName;
  return a.toLowerCase() === "textarea";
}

// Code execution
function execHydra(index) {
  console.log("execHydra: " + index)
  const code = document.getElementById("hIn" + index).value;
  eval("hydraInstances[" + index + "]." + code)
}

// Window resize handler
function resizeMain() {
  document.getElementById("out1").width = window.innerWidth;
  document.getElementById("out1").height = window.innerHeight;
  document.getElementById("nocursor").style.height = window.innerHeight + "px";
  document.getElementById("srcPreviews").style.width = `${Math.max(720,720 * Math.floor(window.innerWidth / 720))}px`;
}
resizeMain();
window.addEventListener('resize', resizeMain);
