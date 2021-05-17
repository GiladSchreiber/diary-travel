import React from "react";
import "./GeoMap.scss";

import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

class GeoMap extends React.Component {
  render() {
    const activeId =
      this.props.hoverId >= 0 ? this.props.hoverId : this.props.activeId;
    return (
      <div className="mapContainer">
        <ComposableMap width={960} height={540}>
          <ZoomableGroup zoom={1.2}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} />
                ))
              }
            </Geographies>

            {this.props.chapters.map(({ index, wordsCount, place }) => (
              <Marker
                key={"place" + index}
                id={"place" + index}
                coordinates={[place.y, place.x]}
              >
                <g
                  className={
                    index === activeId ? "regularDot active" : "regularDot"
                  }
                >
                  <circle
                    cx="0"
                    cy="0"
                    r={
                      index === activeId
                        ? Math.min(0.004 * wordsCount, 3)
                        : Math.min(0.002 * wordsCount, 2)
                    }
                    onMouseEnter={() => this.props.setHover(index)}
                    onMouseOut={() => this.props.setHover(-1)}
                    onClick={() => this.props.setActive(index)}
                  />
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>
      </div>
    );
  }
}

export default GeoMap;
