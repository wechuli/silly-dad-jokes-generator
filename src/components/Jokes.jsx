import React, { Component } from "react";
import axios from "axios";

export class Jokes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jokes: []
    };
  }
  static defaultProps = {
    numJokesToGet: 10
  };
  async componentDidMount() {
    //load Jokes
    let jokes = [];
    while (jokes.length < this.props.numJokesToGet) {
      let res = await axios.get("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" }
      });
      jokes.push(res.data.joke);
    }
    this.setState({ jokes });
  }
  render() {
    return (
      <div className="JokeList">
        <h1>Dad Jokes</h1>
        <div className="JokeList-jokes">
          {this.state.jokes.map(joke => {
            return <div>{joke}</div>;
          })}
        </div>
      </div>
    );
  }
}

export default Jokes;
