import pg from "pg";

const pool = new pg.Pool();
pool.on("error", (err, client) => {
  console.error(`Unexpected error on idle client: `, err);
  client.release();
});

export async function getSources(room) {
  const client = await pool.connect();
  let data;
  try {
    data = await client.query(
      `SELECT * FROM sources WHERE room = '${room}' ORDER BY id ASC`
    );
  } catch (e) {
    console.error("Error retrieving sources from database: " + e);
    client.release();
    return [];
  }

  client.release();
  return data.rows;
}

export async function addSrc(file, callback) {
  const room = file.room;
  const type = file.type;

  const client = await pool.connect();
  try {
    await client.query({
      text: `INSERT INTO sources(room, type, data) VALUES($1, $2, $3)`,
      values: [room, type, file.src],
    });
  } catch (e) {
    console.error("Error adding source to database: " + e);
    client.release();
    callback({ message: "failure" });
  }

  client.release();
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
    console.error("Error deleting source to database: " + e);
    client.release();
    callback({ message: "failure" });
    return;
  }

  client.release();
  callback({ message: "success" });
}

export async function updateSrc(file, callback) {
  let setQ = "";
  const queryVals = [];
  let delineator = "";
  if (file.src !== undefined) {
    queryVals.push(file.src);
    setQ += `${delineator}data = $${queryVals.length}`;
    delineator = ", ";
  }
  if (file.alpha !== undefined) {
    queryVals.push(file.alpha);
    setQ += `${delineator}alpha = $${queryVals.length}`;
    delineator = ", ";
  }
  if (file.active !== undefined) {
    queryVals.push(file.active);
    setQ += `${delineator}active = $${queryVals.length}`;
    delineator = ", ";
  }

  if (queryVals.length === 0) {
    callback({ message: "failure" });
    return;
  }

  queryVals.push(file.id);
  const query = {
    text: `UPDATE sources SET ${setQ} WHERE id = $${queryVals.length}`,
    values: queryVals,
  };

  const client = await pool.connect();
  try {
    await client.query(query);
  } catch (e) {
    console.error("Error updating database: " + e);
    client.release();
    callback({ message: "failure" });
    return;
  }

  client.release();
  callback({ message: "success" });
}
