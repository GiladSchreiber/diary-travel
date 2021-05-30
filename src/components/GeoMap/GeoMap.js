import React from "react";
import "./GeoMap.scss";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Line,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const lines = require("../../data/lines.json").lines;
var linesCoords = [];

class GeoMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLines: false,
    };
  }
  buildClasses = (index) => {
    var markersClasses = "regularDot ";
    if (index === this.props.hoverId || index === this.props.activeId) {
      markersClasses += " active ";
    }
    if (
      this.props.searchIndices.includes(index) ||
      this.props.searchIndices.includes(index.toString())
    ) {
      markersClasses += " searched ";
    }
    if (this.props.mapLinesState) {
      markersClasses += " fullOpacity ";
    }
    return markersClasses;
  };

  componentDidMount() {
    lines.map(({ x, y }) => linesCoords.push([y, x]));
  }

  setMapLinesState = (value) => {
    this.setState({
      showLines: value,
    });
  };

  render() {
    const infoContainer = this.props.infoState ? (
      <div className={"info infoMap " + this.props.infoState} id="infoMap">
        <div className="infoBox infoBoxMap">
          <div className="infoHeader">המפה הגיאוגרפית</div>
          <div className="infoDescription">
            כל נקודה מייצגת קטע ביומן וממוקמת על פי מקום הכתיבה של אותו קטע.
            המפה ניתנת לגרירה ולהגדלה. במעבר על נקודה מוצגים פרטי המסגת ובלחיצה
            הפרק יגלל למסך.
          </div>
        </div>
      </div>
    ) : null;
    const linesDiv = this.state.showLines ? (
      <Line
        className={"line"}
        coordinates={linesCoords}
        strokeLinecap="round"
      ></Line>
    ) : null;

    const mapContainerClasses = this.state.showLines
      ? "mapContainer mapContainerLines"
      : "mapContainer";

    const geographyClasses = this.state.showLines
      ? "rsm-geography rsm-geography-lines"
      : "rsm-geography rsm-geography-normal";
    const width = 960,
      height = 540;
    return (
      <div>
        {infoContainer}
        <div className={mapContainerClasses}>
          <div
            className={"infoContainer mapLinesClass mapLinesIcon"}
            onMouseOver={() => this.setMapLinesState(true)}
            onMouseLeave={() => this.setMapLinesState(false)}
          >
            <i className="fas fa-map-marker-alt fa-lg"></i>
          </div>
          <ComposableMap width={width} height={height} className="mapContent">
            <ZoomableGroup
              zoom={1.1}
              minZoom={1.1}
              translateExtent={[
                [105, 60],
                [width - 50, height - 60],
              ]}
            >
              <Geographies className={geographyClasses} geography={geoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} />
                  ))
                }
              </Geographies>
              {linesDiv}
              {this.props.chapters.map(({ index, wordsCount, place }) => (
                <Marker
                  key={"place" + index}
                  id={"place" + index}
                  coordinates={[place.y, place.x]}
                >
                  <g className={this.buildClasses(index)}>
                    <circle
                      cx="0"
                      cy="0"
                      r={
                        index === this.props.hoverId ||
                        index === this.props.activeId
                          ? 2 + 0.0005 * wordsCount
                          : 1 + 0.0005 * wordsCount
                      }
                      onMouseEnter={() => this.props.setHover(index, "geo")}
                      onMouseOut={() => this.props.setHover(-1, "geo")}
                      onClick={() => this.props.setActive(index)}
                    />
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    );
  }
}

export default GeoMap;
