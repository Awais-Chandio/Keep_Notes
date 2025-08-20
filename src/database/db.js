import SQLite from "react-native-sqlite-storage";

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: "app.db", location: "default" });
};

export const createThemeTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS theme (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    isDark INTEGER
  );`;
  await db.executeSql(query);
};

export const saveTheme = async (db, isDark) => {
  // 1 for true, 0 for false
  await db.executeSql(`DELETE FROM theme;`);
  await db.executeSql(`INSERT INTO theme (isDark) VALUES (?);`, [isDark ? 1 : 0]);
};

export const getTheme = async (db) => {
  const results = await db.executeSql(`SELECT * FROM theme LIMIT 1;`);
  if (results[0].rows.length > 0) {
    const row = results[0].rows.item(0);
    return row.isDark === 1; // convert 1/0 to true/false
  }
  return null;
};

export const createNotesTable = async (db) => {
  const query = `CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT
  );`;
  await db.executeSql(query);
};

// save notes
export const saveNote = async (db, title, content) => {
  const insertQuery = `INSERT INTO notes (title, content) VALUES (?, ?);`;
  await db.executeSql(insertQuery, [title, content]);
};

// fetch all notes
export const getAllNotes = async (db) => {
  const results = await db.executeSql(`SELECT * FROM notes;`);
  const items = [];
  results.forEach(result => {
    for (let i = 0; i < result.rows.length; i++) {
      items.push(result.rows.item(i));
    }
  });
  return items;
};

// fetch single note
export const getNoteById = async (db, id) => {
  const results = await db.executeSql(`SELECT * FROM notes WHERE id = ?;`, [id]);
  if (results[0].rows.length > 0) {
    return results[0].rows.item(0);
  }
  return null;
};

// Note update
export const updateNote = async (db, id, title, content) => {
  const updateQuery = `UPDATE notes SET title = ?, content = ? WHERE id = ?;`;
  await db.executeSql(updateQuery, [title, content, id]);
};

// Note delete
export const deleteNote = async (db, id) => {
  const deleteQuery = `DELETE FROM notes WHERE id = ?;`;
  await db.executeSql(deleteQuery, [id]);
};