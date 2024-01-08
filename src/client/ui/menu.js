import * as f from "../model";
import { togglePanel } from "./menuListeners";

export function updateMenu() {
  const editLabel = document.querySelector("#editlabel");
  const buttonsDiv = document.querySelector("#srcbuttons");

  editLabel.innerHTML = f.sources.length === 0 ? "" : "EDIT:";

  while (buttonsDiv.firstChild) buttonsDiv.removeChild(buttonsDiv.firstChild);

  for (let i = 0; i < f.sources.length; i++) {
    const s = f.sources[i];
    const button = document.createElement("button");

    button.id = "additionalEditor" + i;
    if (i === f.activePanel) {
      button.classList.add("active");
    }
    button.onclick = () => {
      togglePanel(i);
    };

    if (s.type === "p5") button.classList.add("p5button");
    else if (s.type === "hydra") button.classList.add("hydrabutton");
    else if (s.type === "video") button.classList.add("videobutton");

    button.innerHTML = i + 1;
    buttonsDiv.appendChild(button);
  }
}
