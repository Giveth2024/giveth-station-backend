// functions/movie.js
const pool = require("../config/db");

async function initMoviesTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS movies (
      id INT AUTO_INCREMENT PRIMARY KEY,
      imdbID VARCHAR(20) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      year VARCHAR(10),
      type VARCHAR(50),
      poster TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(createTableQuery);
}

async function saveMoviesToDB(movies) {
  await initMoviesTable();

  const insertQuery = `
    INSERT INTO movies (imdbID, title, year, type, poster)
    VALUES (?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE 
      title = VALUES(title),
      year = VALUES(year),
      type = VALUES(type),
      poster = VALUES(poster)
  `;

  for (const m of movies) {
    await pool.query(insertQuery, [
      m.imdbID,
      m.Title,
      m.Year,
      m.Type,
      m.Poster,
    ]);
  }
}

async function getMoviesFromDB(query, type = "movie", page = 1) {
  await initMoviesTable();

  // Basic search from DB
  const [rows] = await pool.query(
    `SELECT * FROM movies WHERE title LIKE ? AND type = ? LIMIT 10 OFFSET ?`,
    [`%${query}%`, type, (page - 1) * 10]
  );

  return rows;
}

module.exports = {
  saveMoviesToDB,
  getMoviesFromDB,
};
