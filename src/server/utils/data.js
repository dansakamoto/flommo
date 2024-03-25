import pg from "pg";

var pool;

export function dbConnect() {
  pool = new pg.Pool();
  pool.on("error", (err, client) => {
    console.error(`Unexpected error on idle client: `, err);
    client.release();
  });
  pool.query("SELECT NOW()"); // test db connection
}

export async function getSources(room) {
  if (!room) {
    console.error("Error retrieving sources from database: invalide room ID");
    return [];
  }

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
  if (!file.room || !file.type || !file.src) {
    console.error("Error adding source to database: invalid input received");
    callback({ message: "failure " });
    return;
  }

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
  if (!file.id) {
    console.error("Error deleting source from database: invalid ID");
    callback({ message: "failure " });
    return;
  }

  const id = file.id;

  try {
    await pool.query({
      text: `DELETE FROM sources WHERE id = $1`,
      values: [id],
    });
  } catch (e) {
    console.error("Error deleting source from database: " + e);
    callback({ message: "failure" });
    return;
  }

  callback({ message: "success" });
}

export async function updateSrc(file, callback) {
  if (!file.id) {
    console.error("Error updating database: invalid ID");
    callback({ message: "failure" });
    return;
  }

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
    console.error("Error updating database: invalid values");
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

export async function updateMixer(file, callback) {
  // validate: expected - file.room
  // check for existing record
  // if doesn't exist:
  // set up model object with default values
  // check for received data, update model object
  // add new entry using model object
  // else (if does exist):
  // update record with received data
  // send response via callback
  // ADDITIONAL: update getSources() above to include mixer in api
}
