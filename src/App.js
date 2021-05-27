import "./App.scss";
import React from "react";
import TextFrame from "./components/TextFrame/TextFrame";
import ScrollBar from "./components/ScrollBar/ScrollBar";
import EmotionsMap from "./components/EmotionsMap/EmotionsMap";
import GeoMap from "./components/GeoMap/GeoMap";
import Players from "./components/Players/Players";
import AutoComplete from "./components/AutoComplete/AutoComplete";

var data = require("./data/chapters.json");
var searchFile = require("./data/search.json");
var searchDict = require("./data/searchDict.json");
var defs = require("./data/Defs.json");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chaptersList: [],
      chapterIndex: 0,
      searchIndices: {},
      activeId: 0,
      hoverId: -1,
      prevHoverId: 0,
      scrollPos: 0,
      heightFract: 0,
      infoState: "",
    };
  }

  handleSearch = (string) => {
    if (!string) {
      return;
    }
    console.log(
      "searching for " + string // + ", normalized form: " + normalizedForm
    );
    var searchIndices = {};
    const word = searchDict.find((word) => word.display === string);
    if (word) {
      const normalized = word.normalized;
      searchIndices = searchFile.search[normalized];
    }
    this.setState({
      searchIndices: searchIndices,
    });
  };

  setActive = (id) => {
    this.setState({
      activeId: id,
    });
  };

  setHover = (id) => {
    if (id > -1) {
      this.setState({
        hoverId: id,
      });
    } else {
      this.setState({
        prevHoverId: this.state.hoverId,
        hoverId: id,
      });
    }
  };

  produceEmotionsString = (emotions) => {
    var emotionsString = "";
    defs.emotions.map(({ type, hebrewLabel }) => {
      const value = emotions.find((emotion) => emotion.type === type).value;
      if (value > 0) {
        emotionsString += hebrewLabel + ": " + parseInt(value * 100) + "%, ";
      }
    });
    return emotionsString.slice(0, -2);
  };

  setScrollPos = (scrollPos) => {
    this.setState({
      scrollPos: scrollPos,
    });
  };

  setHeightFract = (heightFract) => {
    this.setState({
      heightFract: heightFract,
    });
  };

  setInfoState = (value) => {
    if (value) {
      this.setState({
        infoState: "fadeIn",
      });
    } else {
      this.setState({
        infoState: "fadeOut",
      });
      setTimeout(
        function () {
          this.setState({ infoState: "" });
        }.bind(this),
        300
      );
    }
  };

  render() {
    const hoverChapter =
      this.state.hoverId == -1
        ? data.chapters[this.state.prevHoverId]
        : data.chapters[this.state.hoverId];
    return (
      <div>
        <div
          className={"infoContainer infoIcon"}
          onMouseOver={() => this.setInfoState(true)}
          onMouseLeave={() => this.setInfoState(false)}
        >
          <i className="fas fa-question fa-lg"></i>
        </div>
        <div className="GraphFrame map">
          <GeoMap
            chapters={data.chapters}
            activeId={this.state.activeId}
            setActive={this.setActive}
            setHover={this.setHover}
            hoverId={this.state.hoverId}
            searchIndices={this.state.searchIndices}
            infoState={this.state.infoState}
          />
        </div>
        <div className="EmotionsFrame">
          <AutoComplete onSearch={this.handleSearch} />

          <EmotionsMap
            chapters={data.chapters}
            activeId={this.state.activeId}
            setActive={this.setActive}
            setHover={this.setHover}
            hoverId={this.state.hoverId}
            searchIndices={this.state.searchIndices}
            infoState={this.state.infoState}
          />
        </div>
        <div className="textFrame">
          <Players chapters={data.chapters} activeId={this.state.activeId} />
          <TextFrame
            chapters={data.chapters}
            onSearch={this.handleSearch}
            setActive={this.setActive}
            activeId={this.state.activeId}
            hoverId={this.state.hoverId}
            searchIndices={this.state.searchIndices}
            setScrollPos={this.setScrollPos}
            heightFract={this.state.heightFract}
            infoState={this.state.infoState}
          />

          <div
            className={"hoverBox"}
            id="hoverBox"
            style={{
              left: this.state.hoverId === -1 ? 0 : "-200px",
            }}
          >
            <div className="hoverEmotions" id="hoverEmotions">
              {this.produceEmotionsString(hoverChapter.headerEmotions)}
            </div>
            <div className="hoverHeader" id="hoverHeader">
              {hoverChapter.header}
            </div>
            <div className="hoverDate" id="hoverDate">
              {hoverChapter.date.day +
                "." +
                hoverChapter.date.month +
                "." +
                hoverChapter.date.year}
            </div>
            <div className="hoverPlace" id="hoverPlace">
              {hoverChapter.place.city + ", " + hoverChapter.place.country}
            </div>
          </div>
        </div>
        <div className="scrollBarContainer">
          <ScrollBar
            chapters={data.chapters}
            hoverId={this.state.hoverId}
            scrollPos={this.state.scrollPos}
            setScrollPos={this.setScrollPos}
            searchIndices={this.state.searchIndices}
            setHeightFract={this.setHeightFract}
            setHover={this.setHover}
            infoState={this.state.infoState}
          />
        </div>
      </div>
    );
  }
}

export default App;
