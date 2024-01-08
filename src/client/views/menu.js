import { sources } from "../models/sources";
import { activePanel } from "../models/panels";
import { togglePanel } from "../controllers/panels";

export function updateMenuButtons() {
  const editLabel = document.querySelector("#editlabel");
  const buttonsDiv = document.querySelector("#srcbuttons");

  editLabel.innerHTML = sources.length === 0 ? "" : "EDIT:";

  while (buttonsDiv.firstChild) buttonsDiv.removeChild(buttonsDiv.firstChild);

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    const button = document.createElement("button");

    button.id = "additionalEditor" + i;
    if (i === activePanel) {
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
