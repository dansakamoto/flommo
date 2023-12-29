import { getSources } from "../utils/fileManager.js";

export function srcList(req, res) {
  const room = req.query.room;
  const sources = getSources(room);
  res.send(sources);
}
