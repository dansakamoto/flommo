import { numSources } from "../utils/sourceManager";

export const outOn = Array(6).fill(false);
export const outAlpha = Array(6).fill(1);
export var blendMode = "source-over";
export var gInvert = false;

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
