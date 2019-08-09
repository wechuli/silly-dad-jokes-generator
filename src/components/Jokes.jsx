import React, { Component } from "react";
import axios from "axios";
import "./Jokes.css";
import Joke from "./Joke";

export class Jokes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false
    };
    this.seenJokes = new Set(
      this.state.jokes.map(j => {
        return j.id;
      })
    );
    console.log(this.seenJokes);
    this.handleVote = this.handleVote.bind(this);
    this.getNewJokes = this.getNewJokes.bind(this);
  }
  static defaultProps = {
    numJokesToGet: 10
  };

  async getJokes() {
    try {
      let jokes = [];
      while (jokes.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com/", {
          headers: { Accept: "application/json" }
        });
        // console.log(res.data);
        // check if the joke is already there

        console.log(this.seenJokes.has(res.data.id));
        if (!this.seenJokes.has(res.data.id)) {
          console.log(res.data.id);
          jokes.push({ joke: res.data.joke, votes: 0, id: res.data.id });
        } else {
          console.log("Found a duplicate");
          console.log(res.data.id);
        }
      }
      this.setState(
        st => ({
          loading: false,
          jokes: [...st.jokes, ...jokes]
        }), // pass a function to setstate to update local storage
        () =>
          window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
    } catch (error) {
      alert(error);
      this.setState({ loading: false });
    }
    //load Jokes
  }
  componentDidMount() {
    if (this.state.jokes.length === 0) {
      this.getJokes();
    }
  }
  getNewJokes() {
    this.setState({ loading: true }, this.getJokes);
  }
  handleVote(id, delta) {
    console.log(id, delta);
    this.setState(
      st => ({
        jokes: st.jokes.map(j =>
          j.id === id ? { ...j, votes: j.votes + delta } : j
        )
      }),
      // pass a function to setstate to update local storage
      () =>
        window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="fas fa-8x fa-laugh fa-spin" />
          <h1 className="JokeList-title">Loading ...</h1>
        </div>
      );
    }
    let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes);
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title">
            <span>Dad</span> Jokes
          </h1>
          <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" />
          <button onClick={this.getNewJokes} className="JokeList-getmore">
            New Jokes
          </button>
        </div>

        <div className="JokeList-jokes">
          {jokes.map(joke => {
            return (
              <Joke
                text={joke.joke}
                key={joke.id}
                votes={joke.votes}
                upvote={() => this.handleVote(joke.id, 1)}
                downvote={() => this.handleVote(joke.id, -1)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Jokes;
