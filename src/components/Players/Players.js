import React from "react";
import WaveSurfer from "./wavesurfer.js";
import "./Players.scss";

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      url: "./sound/" + this.props.chapters[this.props.activeId].song + ".mp3",
    };
  }

  playAfterLoad = () => {
    if (this.props.playlist) {
      this.waveform.play();
    }
  };
  componentDidMount() {
    const track = document.querySelector("#track");
    this.waveform = WaveSurfer.create({
      barWidth: 2,
      cursorWidth: 1,
      container: "#waveform",
      backend: "WebAudio",
      height: 80,
      // fillParent: true,
      progressColor: "#e84e26",
      responsive: true,
      waveColor: "#cbf7e4",
      cursorColor: "transparent",
      minPxPerSec: 10,
    });
    this.waveform.load(track);
    this.waveform.on("ready", () => {
      if (this.state.isPlaying) {
        this.waveform.play();
      }
    });
    this.waveform.on("finish", () => {
      if (this.state.isPlaying) {
        this.waveform.play();
      }
    });
  }

  playButtonClicked = () => {
    this.setState({ isPlaying: !this.state.isPlaying });
    this.waveform.playPause();
  };

  songClicked = (index) => {
    this.props.setActive(index);
    this.props.setPlaylist(false);
  };

  mouseLeaveSong = () => {
    if (!this.props.playlist) {
      setTimeout(
        function () {
          this.props.setHover(-1, "emotion");
        }.bind(this),
        300
      );
    } else {
      this.props.setHover(-1, "emotion");
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.activeId !== this.props.activeId) {
      this.setState({
        url:
          "./sound/" + this.props.chapters[this.props.activeId].song + ".mp3",
      });
      setTimeout(
        function () {
          const track = document.querySelector("#track");
          this.waveform.load(track);
        }.bind(this),
        100
      );

      setTimeout(
        function () {
          document
            .getElementById("song" + Math.max(this.props.activeId - 4, 0))
            .scrollIntoView(true);
        }.bind(this),
        2000
      );
    }
  }

  render() {
    var iconType = this.state.isPlaying ? " fa-pause" : " fa-play";

    return (
      <div
        className="playlistContainer"
        style={{ right: this.props.playlist ? 0 : "-1000px" }}
      >
        <div
          className="infoContainer returnIcon"
          onClick={() => this.props.setPlaylist(false)}
        >
          <i className="fas fa-times fa-md"></i>
        </div>
        <div className="waveformContainer">
          <div className="wave" id="waveform" />
          <div className="playButton" onClick={this.playButtonClicked}>
            <i className={"fas fa-md icon" + iconType}></i>
          </div>
        </div>
        <audio id="track" src={this.state.url} />
        <div className="songsContainer">
          {this.props.chapters.map(({ index, song, artist }) => {
            const songClasses =
              index === this.props.activeId
                ? "songContainer songActive"
                : "songContainer";
            return (
              <div
                className={songClasses}
                key={"song" + index}
                id={"song" + index}
                onClick={() => this.songClicked(index)}
                onMouseOver={() => this.props.setHover(index, "emotion")}
                onMouseLeave={() => this.mouseLeaveSong()}
              >
                <div>{song}</div>
                <div>{artist}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Players;
