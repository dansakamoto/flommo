import "./mixer.css";
import { toggleSrc, updateAlpha, initMixerListeners } from "./mixerListeners";
import session from "../session";

export function updateMixer(type = "hard-refresh") {
  let first = 0;
  if (type === "hard-refresh") {
    first = 0;
  } else if (type === "add") {
    first = session.sources.length - 1;
  }

  for (let i = first; i < session.sources.length; i++) {
    const s = session.sources[i];
    const container = document.getElementById("inputDiv" + i);

    const toggleDiv = document.createElement("div");
    toggleDiv.classList.add("panel");

    const isChecked = s.active ? " checked" : "";

    toggleDiv.innerHTML = `<input type="checkbox" class="srcToggle" id="on${
      i + 1
    }" name="on${i + 1}" value="on${
      i + 1
    }"${isChecked}><label class="label" for="on${i + 1}">Send ${
      i + 1
    }</label><br><input type="range" min="0" max="100" value="${
      s.alpha * 100
    }" class="slider" id="alpha${i + 1}"><br></br>`;

    container.appendChild(toggleDiv);

    document.getElementById(`on${i + 1}`).onchange = () => {
      toggleSrc(i);
    };
    document.getElementById(`alpha${i + 1}`).onpointermove = () => {
      updateAlpha(i);
    };
  }

  initMixer();

  const activeBlendmode = document.getElementById(session.blendMode);
  activeBlendmode.checked = true;

  const invertButton = document.getElementById("invert");
  invertButton.checked = session.globalInvert;
}

function initMixer() {
  if (session.mixerInitialized) return;

  const blendContainer = document.getElementById("blends");
  for (let b of session.allBlendModes) {
    const blendModeName = b[0];
    const keyMap = b[1];

    const container = document.createElement("div");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "blendInput";
    input.id = blendModeName;
    input.value = blendModeName;
    container.appendChild(input);

    const label = document.createElement("label");
    label.htmlFor = blendModeName;
    label.innerHTML = `|${keyMap}| ${blendModeName}`;
    container.appendChild(label);

    blendContainer.appendChild(container);
  }

  initMixerListeners();
  session.setMixerActive();
}
