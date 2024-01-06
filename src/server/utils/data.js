import pg from "pg";

const pool = new pg.Pool();
pool.on("error", (err, client) => {
  console.error(`Unexpected error on idle client`, err);
  client.release();
});

export async function getSources(room) {
  const client = await pool.connect();
  let data;
  try {
    data = await client.query(`SELECT * FROM sources WHERE room = '${room}'`);
  } catch (e) {
    console.error("Error retrieving sources from database" + e);
    client.release();
    return [];
  }

  client.release();
  return data.rows;
}

export async function uploadSrc(file, callback) {
  const room = file.room;
  const type = file.type;
  const ts = Date.now();
  const funcName = "f" + ts;

  const client = await pool.connect();
  try {
    await client.query({
      text: `INSERT INTO sources(room, type, callsign, data) VALUES($1, $2, $3, $4)`,
      values: [room, type, funcName, file.src],
    });
  } catch (e) {
    console.error("Error adding source to database" + e);
    client.release();
    callback({ message: "failure" });
  }

  callback({ message: "success" });
}

export async function delSrc(file, callback) {
  const id = file.id;

  const client = await pool.connect();
  try {
    await client.query({
      text: `DELETE FROM sources WHERE id = $1`,
      values: [id],
    });
  } catch (e) {
    console.error("Error deleting source to database" + e);
    client.release();
    callback({ message: "failure" });
  }

  callback({ message: "success" });
}
