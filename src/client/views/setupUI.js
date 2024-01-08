import { updateConsole } from "../views/mixer";
import { updateMenuButtons } from "../views/menu";
import { updateEditors } from "../views/panels";
import { updateOutputs } from "../views/renderer";

export function setupUI() {
  updateOutputs();
  updateConsole();
  updateEditors();
  updateMenuButtons();
}
