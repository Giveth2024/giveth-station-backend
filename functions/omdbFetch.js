const axios = require("axios");

const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;

async function searchOMDb(query, type = "movie", page = 1) {
  // Fetch directly from OMDb
  const res = await axios.get("http://www.omdbapi.com/", {
    params: { apikey: OMDB_API_KEY, s: query, type, page },
  });

  return res.data; // send OMDb results straight to the frontend
}

async function getDetails(imdbID) {
  const res = await axios.get("http://www.omdbapi.com/", {
    params: { apikey: OMDB_API_KEY, i: imdbID, plot: "short", r: "json" },
  });
  return res.data;
}

module.exports = { searchOMDb, getDetails };
