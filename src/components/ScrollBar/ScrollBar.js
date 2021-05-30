import React from "react";
import "./ScrollBar.scss";

class ScrollBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markerPos: -100,
      chaptersTops: [],
    };
  }

  componentDidMount() {
    const chapters = Array.prototype.slice.call(
      document.getElementsByClassName("chapter")
    );
    const totalHeight = document.getElementById("chapter").offsetHeight;
    const chaptersTops = chapters.map((chapter) => {
      return (chapter.offsetTop / totalHeight) * 100;
    });
    this.setState({
      chaptersTops: chaptersTops,
    });
  }

  scrollBarClicked = (e) => {
    const heightFract = e.clientY / window.innerHeight;
    this.props.setScrollPos(heightFract * 100);
    this.props.setHeightFract(heightFract);
  };

  render() {
    const markers = this.props.searchIndices.map((i) => {
      return (
        <div
          className="marker"
          style={{ top: this.state.chaptersTops[i] + "%" }}
          onMouseEnter={() =>
            this.props.setHover(i, this.state.chaptersTops[i])
          }
          onMouseOut={() => this.props.setHover(-1, this.state.chaptersTops[i])}
        ></div>
      );
    });

    const infoContainer = this.props.infoState ? (
      <div
        className={"info infoScrollBar " + this.props.infoState}
        id="infoScrollBar"
      ></div>
    ) : (
      <div></div>
    );

    var top = -10;
    if (this.props.hoverId >= 0) {
      top = this.state.chaptersTops[this.props.hoverId];
    }

    return (
      <div>
        {infoContainer}
        <div
          className="scrollBar"
          id="scrollBar"
          onMouseDown={(e) => this.scrollBarClicked(e)}
        >
          <div
            className="thumb"
            style={{ height: this.props.scrollPos + "%" }}
          ></div>
          <div
            className="marker"
            id="active"
            style={{
              top: top + "%",
            }}
          ></div>
          {markers}
        </div>
      </div>
    );
  }
}

export default ScrollBar;
