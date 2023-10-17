const outOn = Array(6).fill(false);
const outAlpha = Array(6).fill(1);
var blendMode = "source-over";
var gInvert = false;

// UTILITY FUNCTIONS
function changeBlend() {
  blendMode = document.querySelector("#blendInput").value;
}
function toggleBlend(b){
  blendMode = b;
}
function toggleFilter(f){
  if(f === 'invert') {
    gInvert = !gInvert;
    document.getElementById("#invert").checked = gInvert;
  }
}
function toggleSrc(s){
  outOn[s-1] = (document.querySelector(`#on${s}`).checked) ? true : false;
  document.querySelector("#welcome").style = "display:none;";
  document.getElementById("nocursor").style.cursor = "none";
}

// MIDI LISTENERS
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
    // Dev: 152 keyboard, 144 ableton
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

// KEYBOARD LISTENERS
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
