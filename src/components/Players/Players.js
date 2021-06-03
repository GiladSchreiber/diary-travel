import React from "react";
import WaveSurfer from "./wavesurfer.js";
import "./Players.scss";

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      playlist: false,
      url: "./sound/" + this.props.chapters[this.props.activeId].song + ".mp3",
    };
  }

  playAfterLoad = () => {
    if (this.state.playlist) {
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
      progressColor: "#e84e26",
      responsive: true,
      waveColor: "#cbf7e4",
      cursorColor: "transparent",
    });
    this.waveform.load(track);
    this.waveform.on("ready", () => {
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
    this.setState({ playlist: false });
  };

  mouseLeaveSong = () => {
    if (!this.state.playlist) {
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

    const playlistDiv = (
      <div
        className="playlistContainer"
        onMouseLeave={() => this.setState({ playlist: false })}
        style={{ left: this.state.playlist ? 0 : "1000px" }}
      >
        <div className="waveformContainer">
          <div className="playButton" onClick={this.playButtonClicked}>
            <i className={"fas fa-md icon" + iconType}></i>
          </div>
          <div className="wave" id="waveform" />
          <audio id="track" src={this.state.url} />
        </div>
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
    return (
      <div>
        {playlistDiv}
        <div
          className="iconContainer"
          onMouseEnter={() => this.setState({ playlist: true })}
        >
          <i className="fab fa-itunes-note fa-lg noteIcon"></i>
        </div>
      </div>
    );
  }
}

export default Players;
