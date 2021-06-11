import React from "react";
import "./TextFrame.scss";

class TextFrame extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      isPlaying: false,
      chaptersTops: [],
    };
  }

  updateChapter = () => {
    var id = 0;
    for (var i = 1; i < this.state.chaptersTops.length; i++) {
      if (
        this.props.heightFract > this.state.chaptersTops[i - 1] &&
        this.props.heightFract < this.state.chaptersTops[i]
      ) {
        id = i - 1;
        break;
      }
    }
    this.props.setActive(id);
  };

  componentDidMount() {
    this.containerRef.current.addEventListener("scroll", this.setScrollPos);
    const chapters = Array.prototype.slice.call(
      document.getElementsByClassName("chapter")
    );
    const chaptersTops = chapters.map((chapter) => {
      return (
        chapter.offsetTop / document.getElementById("chapter").offsetHeight
      );
    });
    this.setState({
      chaptersTops: chaptersTops,
    });
  }

  getSentenceElement(chapterIndex) {
    const targetSentenceIndex =
      this.props.chapters[chapterIndex].headerIndices.length === 0
        ? 0
        : this.props.chapters[this.props.hoverId].headerIndices[0];
    return document.getElementById(
      "chapter" + this.props.hoverId + "sentence" + targetSentenceIndex
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.activeId != this.props.activeId &&
      prevProps.hoverId == this.props.activeId
    ) {
      const searchIndices = this.props.searchIndices[this.props.activeId];
      var targetSentence = null;
      if (searchIndices) {
        const targetIndex = searchIndices[0];
        targetSentence = document.getElementById(
          "chapter" + this.props.activeId + "sentence" + targetIndex
        );
        if (!targetSentence) {
          targetSentence = this.getSentenceElement(this.props.activeId);
        }
      } else {
        targetSentence = this.getSentenceElement(this.props.activeId);
      }
      targetSentence.scrollIntoView(true);
      document.getElementById("content").scrollTop -= 300;
      this.props.setScrollPos(this.state.chaptersTops[this.props.activeId]);
    }
    if (prevProps.heightFract != this.props.heightFract) {
      const content = this.containerRef.current;
      content.scrollTo({
        top:
          this.props.heightFract *
          document.getElementById("chapter").offsetHeight,
        // behavior: "smooth",
      });
      this.updateChapter();
    }
  }

  setScrollPos = () => {
    const content = this.containerRef.current;
    const contentScroll = content.scrollTop;
    const height = document.getElementById("chapter").offsetHeight;
    const screenHeight = content.offsetHeight;
    const scrollPercentage = contentScroll / height;
    this.props.setScrollPos(
      ((contentScroll + scrollPercentage * screenHeight) / height) * 100
    );
    const heightFract = contentScroll / height;
    const moveToNextChapter =
      this.props.activeId < this.state.chaptersTops.length - 2 &&
      heightFract > this.state.chaptersTops[this.props.activeId + 1] &&
      heightFract < this.state.chaptersTops[this.props.activeId + 2];

    const moveToPreviousChapter =
      this.props.activeId > 0 &&
      heightFract > this.state.chaptersTops[this.props.activeId - 1] &&
      heightFract < this.state.chaptersTops[this.props.activeId];
    if (moveToNextChapter) {
      this.props.setActive(this.props.activeId + 1);
    }
    if (moveToPreviousChapter) {
      this.props.setActive(this.props.activeId - 1);
    }
  };

  render() {
    const textSpan = this.props.chapters.map(
      ({ index, date, sentences, place, song, artist, headerIndices }) => {
        const searchIndices = this.props.searchIndices[index];
        const sentencesDivs = sentences.map((sentence, j) => {
          var spanClass = "";
          if (searchIndices) {
            if (searchIndices.find((i) => parseInt(i) == j)) {
              spanClass += "searched";
            }
          }
          headerIndices.map((activeSentence) => {
            if (j === parseInt(activeSentence)) {
              spanClass += " active";
              if (index === this.props.activeId) {
                spanClass += " currentActive";
              }
            }
          });
          return (
            <span
              key={j}
              id={"chapter" + index + "sentence" + j}
              className={spanClass}
            >
              {sentence}
            </span>
          );
        });

        const dateString = date.day + "." + date.month + "." + date.year;
        const placeString = place.city + ", " + place.country;
        return (
          <div
            key={"chapter" + index}
            id={"chapter" + index}
            className="chapter"
          >
            <div className="sticky" id={index}>
              <div className="details">
                <div>
                  {index + 1 + "/267 | " + dateString + " | " + placeString}
                </div>
                <div></div>
              </div>
              <div className="details">
                <div>{song + " | " + artist}</div>
                <div></div>
              </div>
            </div>
            <div className="chapterContent">{sentencesDivs}</div>
          </div>
        );
      }
    );

    const infoContainer = this.props.infoState ? (
      <div className={"infoText " + this.props.infoState} id="infoText">
        <div className="logo"></div>
        <div className="stickyContainer">
          <div className="infoSticky"></div>
        </div>
        <div className="desc">
          הצעת קריאה חדשה של טקסטים אישיים שאינה כרונולוגית בהכרח, אלא מותאמת
          לקורא לפי תוכן, רגש ואווירה.
        </div>

        <div className="infoBox infoBoxScrollBar">
          <div className="infoHeader">ציר הזמן</div>
          <div className="infoDescription">
            הציר מימין מציג את מקום הגלילה ביחס לכלל הטקסט, ומאפשר ניווט דרך
            לחיצה על נקודה בציר.
          </div>
        </div>
        <div className="infoBox infoBoxDetails">
          <div className="infoHeader">הטקסט</div>
          <div className="infoDescription">
            בראש כל פרק מופיעים המקום, הזמן והשיר לו האזנתי במהלך הכתיבה. במעבר
            בין פרקים ביומן יודגשו הנקודות המתאימות במפות.
          </div>
        </div>
      </div>
    ) : (
      <div></div>
    );

    return (
      <div>
        {infoContainer}
        <div className="TextContainer">
          <div
            className="infoContainer expandIcon"
            onClick={() => this.props.setWideScreen()}
          >
            <i
              className={
                this.props.wideScreen
                  ? "fas fa-minus fa-sm"
                  : "fas fa-plus fa-sm"
              }
            ></i>
          </div>
          <div
            className="infoContainer iconContainer"
            onClick={() => this.props.setPlaylist(true)}
          >
            <i className="fab fa-itunes-note fa-lg"></i>
          </div>
          <div className="content" id="content" ref={this.containerRef}>
            <div key={"chapter"} id={"chapter"}>
              {textSpan}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TextFrame;
