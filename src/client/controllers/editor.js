import { fetchSources } from "../services/data";
import { updateSources, roomID } from "../models/sources";
import { setupUI } from "../views/setupUI";

export async function refreshSources() {
  const newSources = await fetchSources(roomID);
  updateSources(newSources);
  setupUI();
}
