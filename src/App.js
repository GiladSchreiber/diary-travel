import "./App.scss";
import React from "react";
import TextFrame from "./components/TextFrame/TextFrame";
import ScrollBar from "./components/ScrollBar/ScrollBar";
import EmotionsMap from "./components/EmotionsMap/EmotionsMap";
import GeoMap from "./components/GeoMap/GeoMap";
import Players from "./components/Players/Players";
import AutoComplete from "./components/AutoComplete/AutoComplete";
import Categories from "./components/Categories/Categories";

const data = require("./data/chapters.json");
const searchFile = require("./data/search.json");
const searchDict = require("./data/searchDict.json");
const defs = require("./data/Defs.json");
const categoriesData = require("./data/searchCategories.json");

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chaptersList: [],
      chapterIndex: 0,
      searchObjects: {},
      searchIndices: [],
      activeId: 0,
      hoverId: -1,
      prevHoverId: 0,
      scrollPos: 0,
      heightFract: 0,
      infoState: "",
      hoverTop: 0,
      hoverSource: "",
      category: "words",
    };
  }

  handleSearch = (string) => {
    if (!string) {
      return;
    }
    console.log(
      "searching for " + string // + ", normalized form: " + normalizedForm
    );
    var searchObjects = {};
    var searchIndices = [];
    if (this.state.category == "words") {
      const word = searchDict.find((word) => word.display === string);
      if (word) {
        const normalized = word.normalized;
        searchObjects = searchFile.search[normalized];
        searchIndices = Object.keys(searchObjects);
      }
      console.log(searchIndices);
      this.setState({
        searchObjects: searchObjects,
        searchIndices: searchIndices,
      });
    } else {
      const indices = categoriesData[this.state.category][string];
      console.log(indices);
      this.setState({
        searchObjects: {},
        searchIndices: indices ? indices : [],
      });
    }
  };

  setActive = (id) => {
    console.log("active", id);
    this.setState({
      activeId: id,
    });
  };

  setHoverMaps = (id, source) => {
    if (id > -1) {
      this.setState({
        hoverId: id,
        hoverSource: source,
      });
    } else {
      if (this.state.hoverId > -1) {
        this.setState({
          prevHoverId: this.state.hoverId,
        });
      }
      this.setState({
        hoverId: id,
      });
    }
  };

  setHoverScrollBar = (id, top) => {
    if (id > -1) {
      this.setState({
        hoverId: id,
        hoverSource: "scrollBar",
        hoverTop: top,
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

  setCategory = (category) => {
    console.log("category is: " + category);
    this.setState({ category: category });
  };

  render() {
    return (
      <div>
        <div
          className={"infoContainer infoClass infoIcon"}
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
            setHover={this.setHoverMaps}
            hoverId={this.state.hoverId}
            searchIndices={this.state.searchIndices}
            infoState={this.state.infoState}
          />
        </div>
        <div className="EmotionsFrame">
          <Categories setCategory={this.setCategory} />
          <AutoComplete
            onSearch={this.handleSearch}
            category={this.state.category}
          />

          <EmotionsMap
            chapters={data.chapters}
            activeId={this.state.activeId}
            setActive={this.setActive}
            setHover={this.setHoverMaps}
            hoverId={this.state.hoverId}
            searchIndices={this.state.searchIndices}
            infoState={this.state.infoState}
          />
        </div>
        <div className="textFrame">
          <Players
            chapters={data.chapters}
            activeId={this.state.activeId}
            setActive={this.setActive}
            setHover={this.setHoverMaps}
          />
          <TextFrame
            chapters={data.chapters}
            onSearch={this.handleSearch}
            setActive={this.setActive}
            activeId={this.state.activeId}
            hoverId={this.state.hoverId}
            searchIndices={this.state.searchObjects}
            setScrollPos={this.setScrollPos}
            heightFract={this.state.heightFract}
            infoState={this.state.infoState}
          />
          {this.createHoverBoxText()}
        </div>
        <div className="scrollBarContainer">
          <ScrollBar
            chapters={data.chapters}
            hoverId={this.state.hoverId}
            scrollPos={this.state.scrollPos}
            setScrollPos={this.setScrollPos}
            searchIndices={this.state.searchIndices}
            setHeightFract={this.setHeightFract}
            setHover={this.setHoverScrollBar}
            infoState={this.state.infoState}
          />
          {this.createHoverBoxScrollBar()}
        </div>
      </div>
    );
  }

  createHoverBoxScrollBar() {
    const hoverChapter =
      this.state.hoverId == -1
        ? data.chapters[this.state.prevHoverId]
        : data.chapters[this.state.hoverId];
    const styleParameter = this.state.hoverTop > 50 ? "bottom" : "top";
    const offset =
      this.state.hoverTop > 50
        ? 100 - this.state.hoverTop
        : this.state.hoverTop;
    return (
      <div
        className={"hoverBox hoverBoxScrollBar"}
        id={"hoverBoxScrollBar"}
        style={{
          left:
            this.state.hoverId > -1 && this.state.hoverSource === "scrollBar"
              ? -200 + "px"
              : 0,
          [styleParameter]: offset + "%",
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
    );
  }

  createHoverBoxText() {
    const hoverChapter =
      this.state.hoverId === -1
        ? data.chapters[this.state.prevHoverId]
        : data.chapters[this.state.hoverId];
    const styleParameter = this.state.hoverSource === "geo" ? "bottom" : "top";
    const offset = this.state.hoverSource === "geo" ? "10%" : "20%";

    return (
      <div
        className={"hoverBox hoverBoxText"}
        id={"hoverBoxText"}
        style={{
          left:
            this.state.hoverId > -1 &&
            (this.state.hoverSource === "geo" ||
              this.state.hoverSource === "emotion")
              ? -200 + "px"
              : 0,
          [styleParameter]: offset,
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
    );
  }
}

export default App;
