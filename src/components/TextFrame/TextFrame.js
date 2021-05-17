import React from "react";
import StickyEvents from "sticky-events";
import "./TextFrame.scss";
import Sound from "react-sound";
import Player from "../Player/Player";

class TextFrame extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      scrollPos: 0,
      markerPos: -100,
      isPlaying: false,
      chaptersTops: [],
    };
  }

  updateChapter = () => {
    const content = document.getElementById("content");
    const contentHeight = content.scrollTop;
    var id = 0;
    for (var i = 1; i < this.state.chaptersTops.length; i++) {
      if (
        contentHeight > this.state.chaptersTops[i - 1] &&
        contentHeight < this.state.chaptersTops[i]
      ) {
        id = i - 1;
        break;
      }
    }
    this.props.setActive(id);
  };

  componentDidMount() {
    this.containerRef.current.addEventListener("scroll", this.setScrollPos);
    const stickyEvents = new StickyEvents({
      container: document.querySelector("#content"),
      enabled: false,
      stickySelector: ".sticky",
    });

    stickyEvents.enableEvents();

    const { stickyElements, stickySelector } = stickyEvents;
    stickyElements.forEach((sticky) => {
      sticky.addEventListener(StickyEvents.STUCK, (event) => {
        if (event.detail.isSticky) {
          // if (Math.abssticky.id )
          // this.updateChapter();
        }
      });
    });

    const chapters = Array.prototype.slice.call(
      document.getElementsByClassName("chapter")
    );
    const chaptersTops = chapters.map((chapter) => {
      return chapter.offsetTop;
    });
    this.setState({
      chaptersTops: chaptersTops,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeId != this.props.activeId) {
      const chapter = document.getElementById("chapter" + this.props.activeId);
      const targetSentenceIndex = Math.max(
        this.props.chapters[this.props.activeId].headerIndices[0] - 4,
        0
      );
      const targetSentence = document.getElementById(
        "chapter" + this.props.activeId + "sentence" + targetSentenceIndex
      );
      targetSentence.scrollIntoView(true);
      this.setState({
        scrollPos: this.state.chaptersTops[this.props.activeId],
      });
    }

    if (prevProps.hoverId != this.props.hoverId) {
      var markerPos = -100;
      if (this.props.hoverId >= 0) {
        markerPos =
          (this.state.chaptersTops[this.props.hoverId] /
            document.getElementById("chapter").offsetHeight) *
          100;
      }
      this.setState({
        markerPos: markerPos,
      });
    }
  }

  setScrollPos = () => {
    const content = document.getElementById("content");
    const winScroll = content.scrollTop;
    const height = document.getElementById("chapter").offsetHeight;
    const screenHeight = content.offsetHeight;
    const scrollPercentage = winScroll / height;
    this.setState({
      scrollPos: ((winScroll + scrollPercentage * screenHeight) / height) * 100,
    });
  };

  scrollFunc = (e) => {
    const content = document.getElementById("content");
    const heightFract = e.clientY / window.innerHeight;
    content.scrollTo({
      top: heightFract * document.getElementById("chapter").offsetHeight,
      behavior: "smooth",
    });
    this.updateChapter();
    const scrollPos =
      heightFract * document.getElementById("chapter").offsetHeight * 100;
    this.setState({
      scrollPos: scrollPos,
    });
  };

  scrollBarClicked = (e) => {
    this.scrollFunc(e);
    document.getElementById("scrollBar").onmousemove = (e) => {
      this.scrollFunc(e);
    };
  };

  scrollBarUp = () => {
    document.getElementById("scrollBar").onmousemove = null;
  };

  playButtonClicked = () => {
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  };

  render() {
    const textSpan = this.props.chapters.map(
      ({ index, date, sentences, place, song, artist, headerIndices }) => {
        const isActive = index === this.props.activeId;
        const sentencesDivs = sentences.map((sentence, j) => {
          var spanClass = "";
          if (isActive) {
            headerIndices.map((activeSentence) => {
              if (j === activeSentence) {
                spanClass = "active";
              }
            });
          }
          return (
            <span
              key={j}
              id={"chapter" + index + "sentence" + j}
              className={spanClass}
            >
              {sentence.sentence}
            </span>
          );
        });

        const dateString = date.day + "." + date.month + "." + date.year;
        var playState =
          index === this.props.activeId && this.state.isPlaying
            ? Sound.status.PLAYING
            : Sound.status.STOPPED;
        var iconType =
          playState === Sound.status.PLAYING ? " fa-play" : " fa-pause";
        return (
          <div
            key={"chapter" + index}
            id={"chapter" + index}
            className="chapter"
          >
            <div className="sticky" id={index}>
              <div className="details">
                <div>{dateString}</div>
                <div>
                  {song + " | " + artist}{" "}
                  <i
                    className={"fas fa-md icon" + iconType}
                    onClick={this.playButtonClicked}
                  ></i>
                </div>
              </div>
              <div className="details">
                <div>{place.city + ", " + place.country}</div>
                <div></div>
              </div>
            </div>
            <Player
              key={"player" + index}
              url={"./sound/" + song + ".mp3"}
              playStatus={playState}
              id={index}
            />
            <div className="chapterContent">{sentencesDivs}</div>
          </div>
        );
      }
    );

    return (
      <div className="TextFrame">
        <div
          className="scrollBar"
          id="scrollBar"
          onMouseDown={(e) => this.scrollBarClicked(e)}
          onMouseUp={() => this.scrollBarUp()}
        >
          <div
            className="thumb"
            style={{ height: this.state.scrollPos + "%" }}
          ></div>

          <div
            className="marker"
            style={{ top: this.state.markerPos + "%" }}
          ></div>
        </div>

        <div className="content" id="content" ref={this.containerRef}>
          <div key={"chapter"} id={"chapter"}>
            {textSpan}
          </div>
        </div>
      </div>
    );
  }
}

export default TextFrame;
