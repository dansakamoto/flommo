const vids = {};
const hydras = {};
const p5s = {};

const p5Instances = [];

const hydraFnctns = [];
const hydraInstances = [];

var numSources = 0;

if (navigator.requestMIDIAccess) console.log('This browser supports WebMIDI!')
  else console.log('WebMIDI is not supported in this browser.');

navigator.requestMIDIAccess()
  .then(onMIDISuccess, onMIDIFailure);

function onMIDISuccess(midiAccess) {
// console.log(midiAccess)
const midi = midiAccess
const inputs = midi.inputs.values()
const input = inputs.next()
console.log(input)
input.value.onmidimessage = onMIDIMessage
}

function onMIDIFailure(e) {
  console.log('Could not access your MIDI devices: ', e)
}


function initSources(sourceList){

  if(!sourceList["vids"].length && !sourceList["hydras"].length && !sourceList["p5s"].length){
    document.getElementById("archive").style.display = "block";
  }

  const vidWrapper = document.getElementById("loadedVids");
  const p5Wrapper = document.getElementById("loadedP5s");
  const hydraWrapper = document.getElementById("loadedHydras");
  const togglePanel = document.getElementById("sourceToggles");

  var i=0;
  for(v of sourceList["vids"]){
    const vElement = document.createElement("video");

    vElement.src = window.location.origin + "/sources/vids/" + v;
    vElement.classList.add("inputSrc");
    vElement.id = "video"+i;
    vElement.width = 720;
    vElement.height = 400;
    vElement.loop = true;
    vElement.autoplay = true;
    vElement.muted = true;

    vidWrapper.appendChild(vElement);

    vids["video"+i] = v;
    i++;
    numSources++;
  }

  var i=0;
  for(h of sourceList["hydras"]){

    const scriptElement = document.createElement("script");
    scriptElement.src = "sources/hydra/" + h;
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

    const hydraCanv = document.createElement("canvas");
    hydraCanv.id = "hydraCanvas"+i;
    hydraCanv.classList.add("inputSrc");
    hydraCanv.width = 720;
    hydraCanv.height = 400;

    hydraWrapper.appendChild(hydraCanv);

    hydras["hydraCanvas"+i] = h;
    i++;
    numSources++;
  }

  var i=0;
  for(p of sourceList["p5s"]){

    const scriptElement = document.createElement("script");
    scriptElement.src = "sources/p5/" + p;
    scriptElement.async = true;

    scriptElement.p = p;
    scriptElement.i = i;

    scriptElement.onload = function() {
      var loc = this.p.substring(0,this.p.lastIndexOf('.'));
      var canvasID = "p5Canvas"+this.i;
      p5Instances.push(new p5(window[loc], canvasID ));
    }
    document.body.appendChild(scriptElement);

    const p5Div = document.createElement("div");
    p5Div.id = "p5Canvas"+i;
    p5Div.classList.add("inputSrc");

    p5Wrapper.appendChild(p5Div);

    p5s["p5Canvas"+i] = p;
    i++;
    numSources++;
  }

  for(let j=0; j<numSources; j++){
    const panelDiv = document.createElement("div");
    panelDiv.classList.add("panel");
    panelDiv.innerHTML = `<input type="checkbox" id="on${j+1}" name="on${j+1}" value="on${j+1}" onchange="toggleSrc(${j+1})"><label for="on${j+1}">Send ${j+1}</label><br><input type="range" min="0" max="100" value="100" class="slider" id="alpha${j+1}"><br></br>`;

    togglePanel.appendChild(panelDiv);

  }

}

async function route(url){
    const response = await fetch(url);
    var data = await response.json();
    initSources(data);
}
route("/srclist");


// INIT MIXER SETTINGS
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

  // GUI listeners
  function toggleSrc(s){
    outOn[s-1] = (document.querySelector(`#on${s}`).checked) ? true : false;
    document.querySelector("#welcome").style = "display:none;";
    document.getElementById("nocursor").style.cursor = "none";
  }

  // MIDI listers
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
        }

      }

    }

  }

  // Keyboard listeners
  document.addEventListener('keydown', (event) => {
    if(event.key >= 0 && event.key <=  9){
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
    }
    else if(event.key == 'i'){
      gInvert = !gInvert;
    }
  }, false);

  // keep output size = to window size
  function resizeMain() {
    document.getElementById("out1").width = window.innerWidth;
    document.getElementById("out1").height = window.innerHeight;
    document.getElementById("nocursor").style.height = window.innerHeight + "px";
  }
  resizeMain();
  window.addEventListener('resize', resizeMain);

  // main update function to run every frame
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
