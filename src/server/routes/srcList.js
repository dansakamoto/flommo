import { getSources } from "../utils/data.js";
import { getDemo } from "../utils/demos.js";

export async function srcList(req, res) {
  const room = req.query.room;

  if (room !== undefined) {
    const sources = await getSources(room);
    res.send(sources);
  } else {
    res.send(getDemo());
  }
}
