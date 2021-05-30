import React from "react";
import WaveSurfer from "./wavesurfer.js";
import "./Players.scss";

class Players extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      right: false,
      playlist: false,
      url: "./sound/" + this.props.chapters[this.props.activeId].song + ".mp3",
    };
  }

  playButtonClicked = () => {
    this.setState({ isPlaying: !this.state.isPlaying });
    this.waveform.playPause();
  };

  setPlaylist = (value) => {
    if (!value) {
      if (this.state.playlist) {
        setTimeout(
          function () {
            this.props.setHover(-1, "emotion");
          }.bind(this),
          800
        );
      }
      this.setState({
        playlist: value,
        right: value,
      });
    } else {
      this.setState({
        right: value,
      });

      setTimeout(
        function () {
          this.setState({
            playlist: value,
          });
        }.bind(this),
        1000
      );
    }
  };

  songClicked = (index) => {
    this.props.setActive(index);
    this.setState({ playlist: false, right: false });
  };

  songHover = (index) => {
    if (this.state.playlist) {
      this.props.setHover(index, "emotion");
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
          console.log("isPlaying " + this.waveform.isPlaying());
          if (this.state.isPlaying) {
            this.waveform.play();
          }
        }.bind(this),
        2000
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
  }

  render() {
    var iconType = this.state.isPlaying ? " fa-pause" : " fa-play";

    const playlistDiv = (
      <div
        className="playlistContainer"
        onMouseLeave={() => this.setPlaylist(false)}
        style={{ left: this.state.right ? 0 : "1000px" }}
      >
        <div className="waveformContainer" onClick={this.playButtonClicked}>
          <div className="playButton">
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
                onMouseOver={() => this.songHover(index)}
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
          onMouseEnter={() => this.setPlaylist(true)}
        >
          <i className="fab fa-itunes-note fa-lg noteIcon"></i>
        </div>
      </div>
    );
  }
}

export default Players;
