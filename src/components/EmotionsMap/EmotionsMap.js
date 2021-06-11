import React from "react";
import "./EmotionsMap.scss";

const defs = require("../../data/Defs.json");
var center = [0, 0];
var emotionsCount = 8;

defs.emotions.map(({ coord }) => {
  center[0] += coord[0];
  center[1] += coord[1];
});
center = [center[0] / emotionsCount, center[1] / emotionsCount];

class EmotionsMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emotionsLabels: this.produceEmotionsLabels(),
    };
  }

  produceEmotionsLabels = () => {
    return defs.emotions.map(({ type, coord, offset, hebrewLabel }) => {
      return (
        <text
          className="label"
          key={type}
          x={coord[0] + offset[0]}
          y={coord[1] + offset[1]}
        >
          {hebrewLabel}
        </text>
      );
    });
  };

  render() {
    const chapterDots = this.props.chapters.map(
      ({ index, headerEmotions, wordsCount }) => {
        var circleClasses = "regularDot nonActiveDot lowOpacity";
        if (
          this.props.searchIndices.includes(index) ||
          this.props.searchIndices.includes(index.toString())
        ) {
          circleClasses = "regularDot searched lowOpacity";
        }
        if (index === this.props.hoverId || index === this.props.activeId) {
          circleClasses = "regularDot activeDot fullOpacity";
        }

        const position = this.calculatePosition(headerEmotions);
        const radius = 3 + 0.004 * wordsCount;

        return (
          <circle
            className={circleClasses}
            style={{ animationDelay: -Math.random() * position[0] }}
            key={"dot" + index}
            id={"dot" + index}
            cx={position[0]}
            cy={position[1]}
            r={radius}
            onMouseEnter={() => this.props.setHover(index, "emotion")}
            onMouseOut={() => this.props.setHover(-1, "emotion")}
            onClick={() => this.props.setActive(index, "emotion")}
          >
            {/* <animate
              attributeName="r"
              values={radius + "; " + radius * 1.1 + "; " + radius}
              dur="2s"
              begin={-radius}
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="cx"
              values={
                position[0] + "; " + position[0] * 1.005 + "; " + position[0]
              }
              dur="5s"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              begin={-radius}
              repeatCount="indefinite"
            />
            <animate
              attributeName="cy"
              values={
                position[1] + "; " + position[1] * 1.005 + "; " + position[1]
              }
              dur="10s"
              keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
              begin={-radius}
              repeatCount="indefinite"
            /> */}
          </circle>
        );
      }
    );
    const infoContainer = this.props.infoState ? (
      <div className={"info " + this.props.infoState} id="infoEmotions">
        <div className="infoBox infoBoxEmotion">
          <div className="infoHeader">המפה הרגשית</div>
          <div className="infoDescription">
            מבוססת על מודל שפה המתייג משפטים בעברית לפי שמונה רגשות. כל נקודה
            מייצגת קטע ביומן, וממוקמת על פי הממוצע המשוקלל של משפט המפתח.
          </div>
        </div>

        <div className="infoBox infoBoxSearch">
          <div className="infoHeader">חיפוש בטקסטים</div>
          <div className="infoDescription">
            חיפוש לפי קטגוריה המדגיש את כלל הקטעים בהם מופיעה מילת החיפוש.
            בלחיצה על תוצאת חיפוש הטקסט יגלל למקום הופעת המילה.
          </div>
        </div>
      </div>
    ) : null;

    return (
      <div>
        {infoContainer}
        <div className="emotionsMap">
          <svg
            className="emotionsContent"
            version="1.1"
            viewBox="0 100 900 850"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMin meet"
          >
            <path
              className="diamond"
              d="M347.51,807.31,218.82,676.76A84.32,84.32,0,0,1,194.56,617l1.31-183.32A84.31,84.31,0,0,1,221,374.23L351.54,245.54a84.28,84.28,0,0,1,59.78-24.26l183.32,1.31a84.29,84.29,0,0,1,59.43,25.12L782.76,378.26A84.26,84.26,0,0,1,807,438l-1.31,183.31a84.29,84.29,0,0,1-25.12,59.44L650,809.48a84.3,84.3,0,0,1-59.78,24.26L407,832.43A84.34,84.34,0,0,1,347.51,807.31Z"
            />
            {this.state.emotionsLabels}
            {chapterDots}
          </svg>
        </div>
      </div>
    );
  }

  calculatePosition = (emotions) => {
    var position = [center[0], center[1]];
    var counter = this.countNonZero(emotions);
    defs.emotions.find(({ type, coord }) => {
      const value = emotions.find((emotion) => emotion.type == type).value;
      position[0] += (value * (coord[0] - center[0])) / counter;
      position[1] += (value * (coord[1] - center[1])) / counter;
    });
    return position;
  };

  countNonZero = (emotions) => {
    var counter = 0;
    emotions.map(({ value }) => {
      if (value > 0) {
        counter++;
      }
    });
    return counter;
  };
}

export default EmotionsMap;
