import { sources, bgUpdateSrc } from "../utils/sourceManager";
import { togglePanel } from "../utils/uiController";

const toggles = document.getElementById("sourceToggles");
const blendModes = ["source-over", "screen", "multiply", "difference"];
const filterModes = ["invert"];
var midiActive = false;

export var blendMode = "source-over";
export var gInvert = false;

if ("requestMIDIAccess" in navigator) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}

for (const b of blendModes) {
  document.getElementById(b).onchange = () => {
    toggleBlend(b);
  };
}

for (const f of filterModes) {
  document.getElementById(f).onchange = () => {
    toggleFilter(f);
  };
}

document.getElementById("midion").onchange = () => {
  toggleMidi();
};

document.addEventListener(
  "keydown",
  (event) => {
    if (
      event.code !== "Space" &&
      event.ctrlKey &&
      event.key >= 0 &&
      event.key <= 9
    ) {
      event.preventDefault();

      sources[event.key - 1].active = !sources[event.key - 1].active;
      bgUpdateSrc(sources[event.key - 1].id, sources[event.key - 1].active);
      document.querySelector(`#on${event.key}`).checked =
        sources[event.key - 1].active;
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
      for (let i = 0; i < sources.count; i++) {
        sources[i].active = false;
        document.querySelector(`#on${i + 1}`).checked = false;
      }
    } else if (event.key === "i" && event.ctrlKey) {
      gInvert = !gInvert;
      document.getElementById("invert").checked = gInvert;
    } else if (event.key == "z" && event.ctrlKey) {
      togglePanel("video");
    } else if (event.key == "x" && event.ctrlKey) {
      togglePanel("hydra");
    } else if (event.key == "c" && event.ctrlKey) {
      togglePanel("p5");
    } else if (event.key == "/" && event.ctrlKey) {
      togglePanel("info");
    } else if (event.key == "." && event.ctrlKey) {
      togglePanel("title");
    }
  },
  false
);

export function refreshToggles() {
  while (toggles.firstChild) toggles.removeChild(toggles.firstChild);

  for (let j = 0; j < sources.length; j++) {
    const s = sources[j];
    const isActive = s.active ? " checked" : "";
    const panelDiv = document.createElement("div");
    panelDiv.classList.add("panel");

    panelDiv.innerHTML = `<input type="checkbox" id="on${j + 1}" name="on${
      j + 1
    }" value="on${j + 1}"${isActive}><label for="on${j + 1}">Send ${
      j + 1
    }</label><br><input type="range" min="0" max="100" value="${
      s.alpha * 100
    }" class="slider" id="alpha${j + 1}"><br></br>`;

    toggles.appendChild(panelDiv);
    document.getElementById(`on${j + 1}`).onchange = () => {
      toggleSrc(j);
    };
    document.getElementById(`alpha${j + 1}`).onpointermove = () => {
      updateAlpha(j);
    };
  }
}

function toggleBlend(b) {
  blendMode = b;
}

function toggleFilter(f) {
  if (f === "invert") {
    gInvert = !gInvert;
    document.getElementById("#invert").checked = gInvert;
  }
}

function updateAlpha(id) {
  sources[id].alpha = document.querySelector(`#alpha${id + 1}`).value / 100;
}

function toggleSrc(id) {
  const s = sources[id];
  s.active = document.querySelector(`#on${id + 1}`).checked ? true : false;
  document.querySelector("#welcome").style = "display:none;";
  document.getElementById("nocursor").style.cursor = "none";
  bgUpdateSrc(sources[id].id, sources[id].active);
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
function toggleMidi() {
  const mSwitch = document.getElementById("midion");
  midiActive = mSwitch.checked;
}

function onMIDIMessage(message) {
  if (!midiActive) return;
  const data = message.data; // [command/channel, note, velocity]
  if (data[0] != 248) console.log(data);
  if (data[0] != 248) {
    const note = data[1];
    const velocity = data[2];
    if (velocity == 127) {
      if (note >= 60 && note <= 69) {
        let n = note - 60;
        sources[n].active = !sources[n].active;
        document.querySelector(`#on${n + 1}`).checked = sources[n].active;
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
