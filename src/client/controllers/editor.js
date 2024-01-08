import { refreshToggles } from "../views/mixer";
import { refreshSrcButtons } from "../views/menu";
import { checkPanelReset } from "../views/panels";
import { refreshEditors } from "../views/panels";
import { resizeEditor } from "../views/panels";
import { fetchSources } from "../services/data";
import { replaceSources } from "../models/sources";
import { room } from "../models/sources";
import { updateOutputs } from "../views/renderer";

export async function refreshSources() {
  const newSources = await fetchSources(room);

  replaceSources(newSources);
  updateOutputs();
  checkPanelReset();
  refreshToggles();
  refreshEditors();
  refreshSrcButtons();
  resizeEditor();
}
