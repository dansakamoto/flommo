import pg from "pg";

const pool = new pg.Pool();
pool.on("error", (err, client) => {
  console.error(`Unexpected error on idle client: `, err);
  client.release();
});

export function testDBConnection() {
  pool.query("SELECT NOW()"); // test db connection
}

export async function getSources(room) {
  let data;
  try {
    data = await pool.query(
      `SELECT * FROM sources WHERE room = '${room}' ORDER BY id ASC`
    );
  } catch (e) {
    console.error("Error retrieving sources from database: " + e);
    return [];
  }

  return data.rows;
}

export async function addSrc(file, callback) {
  const room = file.room;
  const type = file.type;

  try {
    await pool.query({
      text: `INSERT INTO sources(room, type, data) VALUES($1, $2, $3)`,
      values: [room, type, file.src],
    });
  } catch (e) {
    console.error("Error adding source to database: " + e);
    callback({ message: "failure" });
  }

  callback({ message: "success" });
}

export async function delSrc(file, callback) {
  const id = file.id;

  try {
    await pool.query({
      text: `DELETE FROM sources WHERE id = $1`,
      values: [id],
    });
  } catch (e) {
    console.error("Error deleting source to database: " + e);
    callback({ message: "failure" });
    return;
  }

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

  try {
    await pool.query(query);
  } catch (e) {
    console.error("Error updating database: " + e);
    callback({ message: "failure" });
    return;
  }

  callback({ message: "success" });
}
