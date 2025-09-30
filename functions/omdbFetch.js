const axios = require("axios");

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

const { saveMoviesToDB, getMoviesFromDB } = require("../functions/movie");

async function searchOMDb(query, type = "movie", page = 1) {
  // 1️⃣ Check DB first
  const cachedMovies = await getMoviesFromDB(query, type, page);
  if (cachedMovies.length > 0) {
    console.log(`[Cache Hit] Returning movies from DB for query: ${query}`);
    return { Search: cachedMovies };
  }

  // 2️⃣ If not found, fetch from OMDb
  const res = await axios.get("http://www.omdbapi.com/", {
    params: { apikey: OMDB_API_KEY, s: query, type, page },
  });

  if (res.data.Search) {
    await saveMoviesToDB(res.data.Search);
  }

  return res.data;
}

async function getDetails(imdbID) {
  const res = await axios.get("http://www.omdbapi.com/", {
    params: { apikey: OMDB_API_KEY, i: imdbID, plot: "short", r: "json" },
  });
  return res.data;
}

module.exports = { searchOMDb, getDetails };
