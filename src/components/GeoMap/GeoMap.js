import React, { useState } from "react";
import "./GeoMap.scss";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
  Line,
  Annotation,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const lines = require("../../data/lines.json").lines;
const countries = require("../../data/Defs.json").countries;

var linesCoords = [];

class GeoMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLines: false,
      zoom: 1.1,
      center: [0, 0],
    };
  }

  isSearched = (index) => {
    return (
      this.props.searchIndices.includes(index) ||
      this.props.searchIndices.includes(index.toString())
    );
  };

  buildClasses = (index, isSearchedI) => {
    var markersClasses = "regularDot ";
    const isActive =
      index === this.props.hoverId || index === this.props.activeId;
    markersClasses += isSearchedI ? "searched " : "nonActiveDot ";
    if (isActive) {
      markersClasses = "regularDot activeDot ";
    }
    markersClasses +=
      this.state.showLines || isActive ? "fullOpacity" : "lowOpacity";
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

  minusClicked = () => {
    const targetZoom = Math.max(1.1, this.state.zoom / 2);
    this.setState({ zoom: targetZoom });
    if (targetZoom === 1.1) {
      this.setState({ center: [0, 0] });
    }
  };

  render() {
    const infoContainer = this.props.infoState ? (
      <div className={"info infoMap " + this.props.infoState} id="infoMap">
        <div className="infoBox infoBoxMap">
          <div className="infoHeader">המפה הגיאוגרפית</div>
          <div className="infoDescription">
            כל נקודה מייצגת פרק ביומן על פי מקום הכתיבה. המפה ניתנת לגרירה
            ולהגדלה.
          </div>
        </div>

        <div className="infoBox infoBoxDots">
          <div className="infoHeader">הנקודות במפות</div>
          <div className="infoDescription">
            הנקודות מייצגות פרקים ביומן. במעבר על נקודה יופיעו פרטי המסגרת של
            הפרק המתאים, ובלחיצה הפרק יגלל למסך.{" "}
          </div>
        </div>
      </div>
    ) : null;
    const linesDiv = this.state.showLines ? (
      <Line
        className={"line"}
        coordinates={linesCoords}
        strokeLinecap="round"
        strokeWidth={1.0 / this.state.zoom}
      />
    ) : null;

    const annotationsDiv = this.state.showLines ? this.annotations() : null;
    const mapContainerClasses = this.state.showLines
      ? " mapContainerLines"
      : "";
    const geographyClasses = this.state.showLines
      ? "rsm-geography rsm-geography-lines"
      : "rsm-geography rsm-geography-normal";
    const mapLinesIconClasses = this.state.showLines
      ? "mapLinesActive"
      : "mapLinesNonActive";
    const width = 960,
      height = 540;

    return (
      <div>
        {infoContainer}
        <div className={"mapContainer" + mapContainerClasses}>
          <div
            className={mapLinesIconClasses + " infoContainer mapLinesIcon"}
            onClick={() => this.setState({ showLines: !this.state.showLines })}
          >
            <i
              className="fas fa-plane fa-lg"
              style={{ transform: "rotate(-30deg)" }}
            ></i>
          </div>
          <div
            className={
              "plusClass " + mapLinesIconClasses + " infoContainer mapLinesIcon"
            }
            onClick={() =>
              this.setState({ zoom: Math.min(8, this.state.zoom * 2) })
            }
          >
            <i className="fas fa-plus fa-sm"></i>
          </div>
          <div
            className={
              "minusClass " +
              mapLinesIconClasses +
              " infoContainer mapLinesIcon"
            }
            onClick={() => this.minusClicked()}
          >
            <i className="fas fa-minus fa-sm"></i>
          </div>
          <ComposableMap width={width} height={height} className="mapContent">
            <ZoomableGroup
              zoom={this.state.zoom}
              center={this.state.center}
              minZoom={1.1}
              onMoveEnd={(e) =>
                this.setState({ zoom: e.zoom, center: e.coordinates })
              }
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
              {annotationsDiv}
              {this.props.chapters.map(({ index, place }) => (
                <Marker
                  key={"place" + index}
                  id={"place" + index}
                  coordinates={[place.y, place.x]}
                >
                  <g
                    className={this.buildClasses(index, this.isSearched(index))}
                  >
                    <circle
                      cx="0"
                      cy="0"
                      r={6 / this.state.zoom}
                      onMouseEnter={() => this.props.setHover(index, "geo")}
                      onMouseOut={() => this.props.setHover(-1, "geo")}
                      onClick={() => this.props.setActive(index)}
                    ></circle>
                  </g>
                </Marker>
              ))}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    );
  }

  annotations = () => {
    return countries.map(({ name, coords, dx, dy, curve, anchor, offset }) => {
      return (
        <Annotation
          subject={coords}
          dx={dx}
          dy={dy}
          curve={curve}
          connectorProps={{
            stroke: "#e84e26",
            strokeWidth: 0.5 + 0.5 / this.state.zoom,
            strokeLinecap: "round",
            strokeDasharray: "0.5 4",
          }}
        >
          <text
            x={offset}
            textAnchor={anchor}
            alignmentBaseline="middle"
            fontSize={3 + 10 / this.state.zoom + "pt"}
          >
            {name}
          </text>
        </Annotation>
      );
    });
  };
}

export default GeoMap;
