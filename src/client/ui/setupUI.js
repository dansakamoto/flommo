import { updateMixer } from "./mixer";
import { updateMenu } from "./menu";
import { updateEditors, resizeEditors } from "./editors";
import { updateRenderer, resizeRenderer } from "./renderer";

export function setupUI() {
  updateRenderer();
  updateMixer();
  updateEditors();
  updateMenu();
  resizeRenderer();
  resizeEditors();
}
