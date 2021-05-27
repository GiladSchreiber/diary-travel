import React from "react";
import Sound from "react-sound";
import Player from "./Player";
import "./Players.scss";

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
    };
  }

  playButtonClicked = () => {
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  render() {
    const sounds = this.props.chapters.map(({ index, song }) => {
      var playState =
        index === this.props.activeId && this.state.isPlaying
          ? Sound.status.PLAYING
          : Sound.status.STOPPED;
      return (
        <Player
          key={"player" + index}
          url={"./sound/" + song + ".mp3"}
          playStatus={playState}
          id={index}
        />
      );
    });

    var iconType = this.state.isPlaying ? " fa-pause" : " fa-play";
    return (
      <div>
        <div className="iconContainer">
          <i
            className={"fas fa-md icon" + iconType}
            onClick={this.playButtonClicked}
          ></i>
        </div>
        {sounds}
      </div>
    );
  }
}

export default Players;
