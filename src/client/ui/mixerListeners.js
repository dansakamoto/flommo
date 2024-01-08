import { updateSrc } from "../services/data";
import { togglePanel } from "./menuListeners";
import session from "../session";

export { updateAlpha, toggleSrc };

if ("requestMIDIAccess" in navigator) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
}
for (const b of session.allBlendModes) {
  document.getElementById(b).onchange = () => {
    session.setBlendMode(b);
  };
}
document.getElementById("invert").onchange = () => {
  session.toggleInvert();
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

      session.sources[event.key - 1].active =
        !session.sources[event.key - 1].active;
      updateSrc(
        session.sources[event.key - 1].id,
        { active: session.sources[event.key - 1].active },
        false
      );
      document.querySelector(`#on${event.key}`).checked =
        session.sources[event.key - 1].active;
      document.getElementById("nocursor").style.cursor = "none";
    } else if (event.key == "q" && event.ctrlKey) {
      session.setBlendMode("source-over");
      document.getElementById("source-over").checked = true;
    } else if (event.key == "w" && event.ctrlKey) {
      session.setBlendMode("screen");
      document.getElementById("screen").checked = true;
    } else if (event.key == "e" && event.ctrlKey) {
      session.setBlendMode("multiply");
      document.getElementById("multiply").checked = true;
    } else if (event.key == "r" && event.ctrlKey) {
      session.setBlendMode("difference");
      document.getElementById("difference").checked = true;
    } else if (event.key == "b" && event.ctrlKey) {
      document.querySelector("#welcome").style = "display:none;";
      document.getElementById("nocursor").style.cursor = "none";
      for (let i = 0; i < session.sources.count; i++) {
        session.sources[i].active = false;
        document.querySelector(`#on${i + 1}`).checked = false;
      }
    } else if (event.key === "i" && event.ctrlKey) {
      document.getElementById("invert").checked = session.toggleInvert();
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
  session.sources[id].alpha =
    document.querySelector(`#alpha${id + 1}`).value / 100;
}

function toggleSrc(id) {
  const s = session.sources[id];
  s.active = document.querySelector(`#on${id + 1}`).checked ? true : false;
  document.querySelector("#welcome").style = "display:none;";
  document.getElementById("nocursor").style.cursor = "none";
  updateSrc(
    session.sources[id].id,
    { active: session.sources[id].active },
    false
  );
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
  session.setMidiActive(mSwitch.checked);
}

function onMIDIMessage(message) {
  if (!session.midiActive) return;
  const data = message.data; // [command/channel, note, velocity]
  if (data[0] != 248) console.log(data);
  if (data[0] != 248) {
    const note = data[1];
    const velocity = data[2];
    if (velocity == 127) {
      if (note >= 60 && note <= 69) {
        let n = note - 60;
        session.sources[n].active = !session.sources[n].active;
        document.querySelector(`#on${n + 1}`).checked =
          session.sources[n].active;
      } else if (note == 70) {
        session.setBlendMode("source-over");
        document.getElementById("source-over").checked = true;
      } else if (note == 71) {
        session.setBlendMode("screen");
        document.getElementById("screen").checked = true;
      } else if (note == 72) {
        session.setBlendMode("multiply");
        document.getElementById("multiply").checked = true;
      } else if (note == 73) {
        session.setBlendMode("difference");
        document.getElementById("difference").checked = true;
      } else if (note == 74) {
        document.getElementById("invert").checked = session.toggleInvert();
      }
    }
  }
}
