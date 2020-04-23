const keys = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

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

app.get('/movies', async (req, res) => {
  const movies = await pgClient.query('SELECT * FROM movies')
    .catch(err => console.log(err));
  res.send(movies.rows);
});

app.post('/movies', async (req, res) => {
  const id = req.body.id;
  const votesIncrement = req.body.votes || 1;

  const votes = await pgClient.query('SELECT votes FROM movies WHERE movie_id=$1', [id])
    .catch(err => console.log(err));
  if(votes.rowCount) {
    const newVotes = Number(votes.rows[0]['votes']) + votesIncrement;
    const movie = await pgClient.query('UPDATE movies SET votes=$1 WHERE movie_id=$2 RETURNING movie_id, votes', [newVotes, id])
      .catch(err => console.log(err));
    res.send(movie.rows[0]);
  }
  else {
    const movie = await pgClient.query('INSERT INTO movies(movie_id, votes) VALUES($1, $2) RETURNING movie_id, votes', [id, 1])
      .catch(err => console.log(err));
    res.send(movie.rows[0]);
  }
});

app.listen(5000, err => {
  console.log('listening');
});

