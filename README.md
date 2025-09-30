Here’s a clean **README** explaining your `server.js` file only. You can save it as `README.md` in your project root.

````markdown
# OMDb Proxy Server

This Node.js server acts as a proxy between your frontend and the OMDb API, allowing you to keep your API key secret and avoid exposing it in the browser.

## Features

- Search movies, TV shows, and anime via OMDb.
- Fetch details for a specific IMDb ID.
- Handles CORS for frontend requests.
- Returns JSON responses to frontend applications.
- Catch-all route for undefined endpoints.

## Server Code Overview (`server.js`)

### 1. Dependencies and Configuration

```js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
````

* **express**: Creates the server and routes.
* **axios**: Handles HTTP requests to OMDb.
* **cors**: Allows frontend requests from a different origin.
* **dotenv**: Loads environment variables from `.env`.

```js
const app = express();
const PORT = process.env.PORT || 5000;
const OMDB_API_KEY = process.env.OMDB_API_KEY;
```

* `PORT`: Server runs on this port (default `5000`).
* `OMDB_API_KEY`: Your secret OMDb API key from `.env`.

### 2. Middleware

```js
app.use(cors());
app.use(express.json());
```

* Enables cross-origin requests.
* Parses incoming JSON payloads.

### 3. Routes

#### a) Search Route

```js
app.get("/api/search", async (req, res) => {
  const { s, type = "movie", page = 1 } = req.query;
```

* Accepts query parameters:

  * `s`: Search keyword (required)
  * `type`: Movie, series, or anime (default: `movie`)
  * `page`: Pagination (default: 1)

```js
const response = await axios.get("http://www.omdbapi.com/", {
  params: { s, type, page, apikey: OMDB_API_KEY },
});
res.json(response.data);
```

* Sends request to OMDb API with the API key.
* Returns OMDb data to the frontend.

#### b) Details Route

```js
app.get("/api/details", async (req, res) => {
  const { id } = req.query;
```

* Accepts `id` parameter (IMDb ID, required).
* Fetches details for a single movie/series/anime:

```js
const response = await axios.get("http://www.omdbapi.com/", {
  params: { i: id, plot: "short", r: "json", apikey: OMDB_API_KEY },
});
res.json(response.data);
```

#### c) Catch-All Route

```js
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});
```

* Returns a 404 error for any undefined route.

### 4. Start Server

```js
app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
```

* Starts the server and logs the running URL.

## Usage

1. Create a `.env` file:

```
OMDB_API_KEY=your_omdb_api_key_here
PORT=5000
```

2. Install dependencies:

```bash
npm install express axios cors dotenv
```

3. Run the server:

```bash
node server.js
```

4. Access endpoints:

* Search: `http://localhost:5000/api/search?s=Batman&type=movie&page=1`
* Details: `http://localhost:5000/api/details?id=tt0372784`

---

**Notes:**

* This server hides your API key from the frontend.
* Use it as a proxy for all OMDb requests in your React/Next.js app.
* Adjust CORS settings if you deploy frontend and backend to different domains.


git init && git add -A && git commit -m "first commit" &&
git branch -M main && git remote add origin https://github.com/Giveth2024/giveth-station-backend.git && git push -u origin main
