import { getSources } from "../utils/data.js";

export async function srcList(req, res) {
  const room = req.query.room;
  const sources = await getSources(room);
  res.send(sources);
}
