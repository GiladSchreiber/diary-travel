import "./App.scss";
import React from "react";
import TextFrame from "./components/TextFrame/TextFrame";
import SearchBar from "./components/SearchBar/SearchBar";
import EmotionsMap from "./components/EmotionsMap/EmotionsMap";
import GeoMap from "./components/GeoMap/GeoMap";

// import axios from "axios";

var data = require("./data/chaptersTest.json");
var searchFile = require("./data/search.json");
var searchDict = require("./data/searchDict.json");

class App extends React.Component {
  constructor(props) {
    super(props);
    const searchWord =
      Object.keys(searchDict)[
        (Object.keys(searchDict).length * Math.random()) << 0
      ];
    const normalizedSearch = searchDict[searchWord];
    // const chaptersList = Object.keys(searchFile.search[normalizedSearch]);
    this.state = {
      chaptersList: [],
      chapterIndex: 0,
      searchWord: searchWord,
      normalizedSearch: normalizedSearch,
      activeId: 0,
      hoverId: -1,
      prevHoverId: 0,
      p1: [0, 0],
      p2: [0, 0],
    };
  }

  handleSearch = (string) => {
    console.log("searching for " + string);
    // this.setState({
    //   searchWord: strippedString,
    // });
    // const data = {
    //   token: "dged4QyCapbDPlo",
    //   type: "SEARCH",
    //   words: [string],
    // };

    // axios
    //   .post("https://hebrew-nlp.co.il/service/Morphology/Normalize", data)
    //   .then((response) => {
    //     console.log(response.data);
    //   });
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
        p1: [
          document.getElementById("dot" + id).getBoundingClientRect().top,
          document.getElementById("dot" + id).getBoundingClientRect().right,
        ],
        p2: [
          document.getElementById("hoverBox").getBoundingClientRect().bottom,
          document.getElementById("hoverBox").getBoundingClientRect().left,
        ],
      });
      // connect(
      //   document.getElementById("dot" + id),
      //   document.getElementById("hoverBox")
      // );
    } else {
      this.setState({
        prevHoverId: this.state.hoverId,
        hoverId: id,
        p1: [0, 0],
        p2: [0, 0],
      });
    }
  };

  render() {
    const hoverClass = this.state.hoverId === -1 ? "" : " fade";
    return (
      <div>
        {/* <svg
          id="lineContainer"
          // width={"1920px"}
          // height={"1080px"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            strokeWidth="5px"
            stroke="#000000"
            x1={this.state.p1[0] + "px"}
            y1={this.state.p2[0] + "px"}
            x2={this.state.p1[1] + "px"}
            y2={this.state.p2[1] + "px"}
            id="mySVG"
          />
        </svg> */}
        <div className="GraphFrame map">
          <GeoMap
            chapters={data.chapters}
            activeId={this.state.activeId}
            setActive={this.setActive}
            setHover={this.setHover}
            hoverId={this.state.hoverId}
          />
        </div>
        <div className="EmotionsFrame">
          <EmotionsMap
            chapters={data.chapters}
            activeId={this.state.activeId}
            setActive={this.setActive}
            setHover={this.setHover}
            hoverId={this.state.hoverId}
          />
          <SearchBar
            onSearch={this.handleSearch}
            searchWord={this.state.searchWord}
          />
          <div className={"hoverBox" + hoverClass} id="hoverBox">
            {this.state.hoverId == -1
              ? data.chapters[this.state.prevHoverId].header
              : data.chapters[this.state.hoverId].header}
          </div>
        </div>
        <TextFrame
          chapters={data.chapters}
          onSearch={this.handleSearch}
          setActive={this.setActive}
          activeId={this.state.activeId}
          hoverId={this.state.hoverId}
        />
      </div>
    );
  }
}

export default App;
