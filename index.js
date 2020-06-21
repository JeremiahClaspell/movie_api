require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(morgan("dev"));
const cors = require("cors");
app.use(cors());
const movies = require("./movies.json");

const port = 8000;
app.listen(port, () => console.log(`listening on ${port}`));

app.use(function validateBearerToken(req, res, next) {
  const bearerToken = req.get("Authorization");
  const apiKey = process.env.API_TOKEN;

  if (!bearerToken || bearerToken.split(" ")[1] !== apiKey) {
    return res.status(401).json({ error: "unauthorized request" });
  }

  next();
});

app.get("/movie", (req, res) => {
  const genre = req.query.genre || "";
  const avg_vote = req.query.avg_vote || "";
  const country = req.query.country || "";
  console.log(genre);
  const movieList = movies.filter((movie) => {
    return (
      movie.country.toLowerCase().includes(country.toLowerCase() || "") &&
      movie.genre.toLowerCase().includes(genre.toLowerCase() || "") &&
      (avg_vote <= movie.avg_vote || avg_vote == "")
    );
  });
  res.send(movieList);
});
