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

// SOURCES INIT / REFRESH
function initSources(sourceList){

  // TO DO - switch dict over to sources, save hydraFnctns inside? rm numSources, rely on sources.length?
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

// Socket - source update listener
const socket = io();
socket.on('srcUpdate', function(msg) {
  getSources(ROOM);
})

// SOURCE UPLOAD
function uploadVid(files) {
  console.log(files[0])
  const status = socket.emit("uploadSrc", { room:ROOM, name: files[0].name, type: "vid", data: files[0] }, (status) => {
    console.log(status);
    if(status.message === "success"){
      getSources(ROOM);
    }
  })
}
function uploadP5() {
  const code = document.getElementById("codeUpload").value;
  document.getElementById("codeUpload").value = "";

  socket.emit("uploadSrc", {room:ROOM, type: "p5", src:code}, (status) => {
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

  socket.emit("uploadSrc", {room:ROOM, type: "hydra", src:code}, (status) => {
    console.log(status);
    if(status.message === "success"){
      getSources(ROOM);
    }
  })
  console.log(code)
}
function uploadCode() {
  const jsType = document.querySelector('input[name="codeType"]:checked').value;
  if(jsType === "typeHydra") uploadHydra()
  else uploadP5()
}

//SOURCE DELETE
function delSrc(type,name){
  socket.emit("delSrc", {type:type, name:name, room:ROOM}, (status) => {
    console.log(status);
    if(status.message === "success"){
      getSources(ROOM);
    }
  })
}
