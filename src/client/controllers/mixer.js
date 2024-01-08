import { sources } from "../models/sources";
import { updateSrc } from "../services/data";
import { togglePanel } from "./panels";
import { blendModes, setBlendMode, toggleInvert } from "../models/mixer";
import { midiActive, setMidiActive } from "../models/mixer";

export { updateAlpha, toggleSrc };

if ("requestMIDIAccess" in navigator) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}
for (const b of blendModes) {
  document.getElementById(b).onchange = () => {
    setBlendMode(b);
  };
}
document.getElementById("invert").onchange = () => {
  toggleInvert();
};
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
      updateSrc(
        sources[event.key - 1].id,
        { active: sources[event.key - 1].active },
        false
      );
      document.querySelector(`#on${event.key}`).checked =
        sources[event.key - 1].active;
      document.getElementById("nocursor").style.cursor = "none";
    } else if (event.key == "q" && event.ctrlKey) {
      setBlendMode("source-over");
      document.getElementById("source-over").checked = true;
    } else if (event.key == "w" && event.ctrlKey) {
      setBlendMode("screen");
      document.getElementById("screen").checked = true;
    } else if (event.key == "e" && event.ctrlKey) {
      setBlendMode("multiply");
      document.getElementById("multiply").checked = true;
    } else if (event.key == "r" && event.ctrlKey) {
      setBlendMode("difference");
      document.getElementById("difference").checked = true;
    } else if (event.key == "b" && event.ctrlKey) {
      document.querySelector("#welcome").style = "display:none;";
      document.getElementById("nocursor").style.cursor = "none";
      for (let i = 0; i < sources.count; i++) {
        sources[i].active = false;
        document.querySelector(`#on${i + 1}`).checked = false;
      }
    } else if (event.key === "i" && event.ctrlKey) {
      document.getElementById("invert").checked = toggleInvert();
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

function updateAlpha(id) {
  sources[id].alpha = document.querySelector(`#alpha${id + 1}`).value / 100;
}

function toggleSrc(id) {
  const s = sources[id];
  s.active = document.querySelector(`#on${id + 1}`).checked ? true : false;
  document.querySelector("#welcome").style = "display:none;";
  document.getElementById("nocursor").style.cursor = "none";
  updateSrc(sources[id].id, { active: sources[id].active }, false);
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
  console.error("Could not access your MIDI devices: ", e);
}

function toggleMidi() {
  const mSwitch = document.getElementById("midion");
  setMidiActive(mSwitch.checked);
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
        setBlendMode("source-over");
        document.getElementById("source-over").checked = true;
      } else if (note == 71) {
        setBlendMode("screen");
        document.getElementById("screen").checked = true;
      } else if (note == 72) {
        setBlendMode("multiply");
        document.getElementById("multiply").checked = true;
      } else if (note == 73) {
        setBlendMode("difference");
        document.getElementById("difference").checked = true;
      } else if (note == 74) {
        document.getElementById("invert").checked = toggleInvert();
      }
    }
  }
}
