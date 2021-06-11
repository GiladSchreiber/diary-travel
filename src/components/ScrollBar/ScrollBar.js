import React from "react";
import "./ScrollBar.scss";

const months = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];
class ScrollBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markerPos: -100,
      chaptersTops: [],
      hoverMouseId: -1,
      mousePos: 0,
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

  onHover = (e) => {
    if (this.props.hoverId >= 0) {
      return;
    }
    const mousePos = (e.clientY / window.innerHeight) * 100;
    var hoverMouseId = -1;
    for (var i = 1; i < this.state.chaptersTops.length; i++) {
      if (
        mousePos > this.state.chaptersTops[i - 1] &&
        mousePos < this.state.chaptersTops[i]
      ) {
        hoverMouseId = i - 1;
        break;
      }
    }
    this.setState({
      hoverMouseId: hoverMouseId,
      mousePos: window.innerHeight - e.clientY,
    });
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
          onMouseOver={() => this.setState({ mousePos: -10 })}
          onMouseOut={() => this.props.setHover(-1, this.state.chaptersTops[i])}
        ></div>
      );
    });

    const infoContainer = this.props.infoState ? (
      <div
        className={"info infoScrollBar " + this.props.infoState}
        id="infoScrollBar"
      ></div>
    ) : null;

    var hoverDate = "";
    var top = -10;
    if (this.props.hoverId >= 0) {
      top = this.state.chaptersTops[this.props.hoverId];
    }

    var mouseMarkerTop = -10;
    if (this.state.hoverMouseId >= 0) {
      const hoverChapter = this.props.chapters[this.state.hoverMouseId];
      hoverDate =
        months[parseInt(hoverChapter.date.month) - 1] +
        " " +
        hoverChapter.date.year;
      mouseMarkerTop = window.innerHeight - this.state.mousePos;
    }

    const colorChoice =
      mouseMarkerTop > (this.props.scrollPos / 100) * window.innerHeight;
    const mouseMarkerClass = colorChoice ? "brightMarker" : "darkMarker";
    const mouseDateClass =
      !colorChoice || this.props.playlist ? "brightDate" : "darkDate";
    return (
      <div>
        {infoContainer}
        <div
          className="scrollBar"
          id="scrollBar"
          onClick={(e) => this.scrollBarClicked(e)}
          onMouseMove={(e) => this.onHover(e)}
          onMouseLeave={() => this.setState({ hoverMouseId: -1 })}
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
          <div
            className="movingDateContainer"
            style={{
              bottom: this.state.hoverMouseId >= 0 ? this.state.mousePos : -10,
            }}
          >
            <div className={"movingDate " + mouseDateClass}>{hoverDate}</div>
            <div className={"hoverMarker " + mouseMarkerClass}></div>
          </div>

          {markers}
        </div>
      </div>
    );
  }
}

export default ScrollBar;
