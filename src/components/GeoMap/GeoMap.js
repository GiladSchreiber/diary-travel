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
  buildClasses = (index) => {
    const sentences = this.props.searchIndices[index];
    var markersClasses = "regularDot";
    if (index === this.props.hoverId || index === this.props.activeId) {
      markersClasses += " active";
    }
    if (sentences) {
      markersClasses += " searched";
    }
    return markersClasses;
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
    ) : (
      <div></div>
    );
    return (
      <div>
        {infoContainer}
        <div className="mapContainer">
          <ComposableMap width={960} height={540} className="mapContent">
            <ZoomableGroup zoom={1.2} maxZoom={10}>
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
      </div>
    );
  }
}

export default GeoMap;
