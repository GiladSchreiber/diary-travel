import React from "react";
import Sound from "react-sound";
// import soundManager from "react-sound";

class Player extends React.Component {
  constructor(props) {
    super(props);
    // soundManager.setup({ debugMode: false });
    this.state = {
      playStatus: Sound.status.STOPPED,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.playStatus !== prevProps.playStatus) {
      this.setState({
        playStatus: this.props.playStatus,
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.playStatus !== this.props.playStatus) {
      return true;
    } else {
      return false;
    }
  }

  handleError(errorCode, description) {
    console.log(errorCode);
    console.log(description);
  }

  render() {
    return (
      <div className="player">
        <Sound
          url={this.props.url}
          playStatus={this.props.playStatus}
          onError={({ errorCode, description }) =>
            this.handleError(errorCode, description)
          }
          autoLoad={false}
        />
      </div>
    );
  }
}

export default Player;
