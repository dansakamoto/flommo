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

  let allData = {},
    sourcesData,
    mixerData;

  try {
    sourcesData = await pool.query(
      `SELECT * FROM sources WHERE room = '${room}' ORDER BY id ASC`
    );
  } catch (e) {
    console.error("Error retrieving sources from database: " + e);
    return {};
  }

  try {
    mixerData = await pool.query(
      `SELECT * FROM mixers WHERE room = '${room}' ORDER BY room ASC`
    );
  } catch (e) {
    console.error("Error retrieving mixers from database: " + e);
    return {};
  }

  allData["sources"] = sourcesData.rows;
  allData["mixerState"] = mixerData.rows[0] ? mixerData.rows[0] : {};

  return allData;
}

export async function addSrc(file, callback) {
  if (!file.room || !file.type || !file.src) {
    console.error("Error adding source to database: invalid input received");
    callback({ message: "failure " });
    return;
  }

  const room = file.room;
  const type = file.type;
  const active = file.active === undefined ? true : file.active;

  let res;

  try {
    res = await pool.query({
      text: `INSERT INTO sources(room, type, data, active) VALUES($1, $2, $3, $4) RETURNING id`,
      values: [room, type, file.src, active],
    });
  } catch (e) {
    console.error("Error adding source to database: " + e);
    callback({ message: "failure" });
    return;
  }

  callback({ message: "success", id: res.rows[0].id });
}

export async function delSrc(file, callback) {
  if (!file.id) {
    console.error("Error deleting source from database: invalid ID");
    callback({ message: "failure" });
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
  if (!file.room) {
    console.error("Error updating mixer: invalid input received");
    callback({ message: "failure" });
    return;
  }

  let room = file.room;

  let data;
  try {
    data = await pool.query(
      `SELECT * FROM mixers WHERE room = '${room}' ORDER BY room ASC`
    );
  } catch (e) {
    console.error("Error retrieving mixers from database: " + e);
    callback({ message: "failure" });
    return;
  }

  if (data.rows.length == 0) {
    let blend = file.blend ? file.blend : "source-over";
    let invert = file.invert == true;
    try {
      await pool.query({
        text: `INSERT INTO mixers(room, blend, invert) VALUES($1, $2, $3)`,
        values: [room, blend, invert],
      });
    } catch (e) {
      console.error("Error adding mixer to database: " + e);
      callback({ message: "failure" });
    }
  } else {
    let setQ = "";
    const queryVals = [];
    let delineator = "";
    if (file.blend !== undefined) {
      queryVals.push(file.blend);
      setQ += `${delineator}blend = $${queryVals.length}`;
      delineator = ", ";
    }
    if (file.invert !== undefined) {
      queryVals.push(file.invert);
      setQ += `${delineator}invert = $${queryVals.length}`;
      delineator = ", ";
    }

    if (queryVals.length === 0) {
      console.error("Error updating database: invalid values");
      callback({ message: "failure" });
      return;
    }

    queryVals.push(file.room);
    const query = {
      text: `UPDATE mixers SET ${setQ} WHERE room = $${queryVals.length}`,
      values: queryVals,
    };

    try {
      await pool.query(query);
    } catch (e) {
      console.error("Error updating mixer in database: " + e);
      callback({ message: "failure" });
      return;
    }

    callback({ message: "success" });
  }
}

export async function initFromDemo(file, callback) {
  if (
    !file.sources ||
    file.sources.length === 0 ||
    !file.mixerState ||
    !file.mixerState.room
  ) {
    console.error("Error initializing from demo: invalid data received");
    callback({ message: "failure" });
    return;
  }

  const sources = file.sources;
  const mixerState = file.mixerState;

  let queryText =
    "INSERT INTO sources (room, type, data, alpha, active) VALUES ";
  let queryVals = [];
  let separator = "";
  for (let s of sources) {
    if (!s.room || !s.type || !s.src) {
      console.error("Error initializing from demo: invalid source data");
      callback({ message: "failure " });
      return;
    }

    queryVals.push(s.room, s.type, s.src, s.alpha, s.active);
    queryText += `${separator}($${queryVals.length - 4}, $${
      queryVals.length - 3
    }, $${queryVals.length - 2}, $${queryVals.length - 1}, $${
      queryVals.length
    })`;
    separator = ", ";
  }

  try {
    await pool.query({
      text: queryText,
      values: queryVals,
    });
  } catch (e) {
    console.error("Error initializing from demo: " + e);
    callback({ message: "failure" });
    return;
  }

  const room = mixerState.room;
  const blend = mixerState.blend ? mixerState.blend : "source-over";
  const invert = mixerState.invert == true;
  try {
    await pool.query({
      text: `INSERT INTO mixers(room, blend, invert) VALUES($1, $2, $3)`,
      values: [room, blend, invert],
    });
  } catch (e) {
    console.error("Error initializing mixer from demo: " + e);
    callback({ message: "failure" });
  }

  callback({ message: "success" });
}
