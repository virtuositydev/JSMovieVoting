const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var swStats = require('swagger-stats');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(swStats.getMiddleware({metricsPrefix: 'movie_voting_'}));

// Postgres
const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});
pgClient.on('error', () => console.log("PG connection error."));

pgClient
  .query('CREATE TABLE IF NOT EXISTS movies (movie_id INT, votes INT)')
  .catch(err => console.log(err));

// Express API
app.get('/', (req, res) => {
  res.send('Hello, Movie Voters!');
});

app.get('/movies', async (req, res, next) => {
  try {
    const movies = await pgClient.query('SELECT * FROM movies')
    res.send(movies.rows);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.post('/movies', async (req, res, next) => {
  try {
    const id = req.body.id;
    const votesIncrement = req.body.votes || 1;

    const votes = await pgClient.query('SELECT votes FROM movies WHERE movie_id=$1', [id])
    if(votes.rowCount) {
      const newVotes = Number(votes.rows[0]['votes']) + votesIncrement;
      const movie = await pgClient.query('UPDATE movies SET votes=$1 WHERE movie_id=$2 RETURNING movie_id, votes', [newVotes, id])
      res.send(movie.rows[0]);
    }
    else {
      const movie = await pgClient.query('INSERT INTO movies(movie_id, votes) VALUES($1, $2) RETURNING movie_id, votes', [id, votesIncrement])
      res.send(movie.rows[0]);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

app.listen(5000, err => {
  console.log('listening');
});
