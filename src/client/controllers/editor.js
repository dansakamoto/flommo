import { refreshToggles } from "../views/mixer";
import { updateMenuButtons } from "../views/menu";
import { updateEditors, resizeEditors } from "../views/panels";
import { fetchSources } from "../services/data";
import { replaceSources, roomID } from "../models/sources";
import { updateOutputs } from "../views/renderer";

export async function refreshSources() {
  const newSources = await fetchSources(roomID);

  replaceSources(newSources);
  updateOutputs();
  refreshToggles();
  updateEditors();
  updateMenuButtons();
  resizeEditors();
}
