import React from "react";
import Sound from "react-sound";

class Player extends React.Component {
  constructor(props) {
    super(props);
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

  handleError(e) {
    console.log(e);
    console.log(e.description);
  }

  render() {
    return (
      <div className="player">
        <Sound
          url={this.props.url}
          playStatus={this.props.playStatus}
          onError={(e) => this.handleError(e)}
          autoLoad={false}
        />
      </div>
    );
  }
}

export default Player;
