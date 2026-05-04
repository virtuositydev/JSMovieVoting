import _ from 'lodash';
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

import BreakingBad from './images/breakingbad.jpg';
import GOT from './images/got.jpg';
import StrangerThings from './images/strangerthings.jpg';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: []
    }
  }

  componentDidMount() {
    this.fetchMovies();
  }

  async fetchMovies() {
    try {
      const movies = await axios.get(`${process.env.REACT_APP_API_URL}/movies`);
      this.setState({ movies: movies.data });
    } catch (e) {
      console.error(e);
    }
  }

  async voteMovie(id, votes=1) {
    try {
      const movie = await axios.post(`${process.env.REACT_APP_API_URL}/movies`, { id, votes });
      this.setState(prevState => {
        const movies = _.unionBy([movie.data], prevState.movies, 'movie_id');
        return { movies }
      });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const { movies } = this.state;
    return (
      <div>
        {/* <nav className="navbar is-primary" role="navigation" aria-label="main navigation"> */}
        <nav className="navbar is-info" role="navigation" aria-label="main navigation">
          <section className="container">
            <div className="navbar-brand">
              <strong className="navbar-item">All Time Best TV Series</strong>
            </div>
          </section>
        </nav>
        <section className="section">
          <div className="container">
            <div className="columns">
              <div className="column">
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-2by3">
                      <img src={BreakingBad} alt="Breaking Bad"/>
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      Votes: {_.get(_.find(movies, { movie_id: 1 }), 'votes', 0)}
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <button className="button is-primary" onClick={() => this.voteMovie(1)}>Vote!</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-2by3">
                      <img src={GOT} alt="Game Of Thrones"/>
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      Votes: {_.get(_.find(movies, { movie_id: 2 }), 'votes', 0)}
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <button className="button is-primary" onClick={() => this.voteMovie(2)}>Vote!</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="column">
                <div className="card">
                  <div className="card-image">
                    <figure className="image is-2by3">
                      <img src={StrangerThings} alt="Stranger Things"/>
                    </figure>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      Votes: {_.get(_.find(movies, { movie_id: 3 }), 'votes', 0)}
                    </div>
                  </div>
                  <div className="card-content">
                    <div className="content">
                      <button className="button is-primary" onClick={() => this.voteMovie(3)}>Vote!</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default App;
