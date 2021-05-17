import React from "react";
import "./EmotionsMap.scss";

const emotionsDict = [
  {
    type: "trust",
    coord: [380, 830],
    offset: [20, 40],
    hebrewLabel: "אמון",
  },
  {
    type: "fear",
    coord: [615, 830],
    offset: [30, 40],
    hebrewLabel: "פחד",
  },
  {
    type: "disgust",
    coord: [800, 645],
    offset: [80, 20],
    hebrewLabel: "גועל",
  },
  {
    type: "anger",
    coord: [800, 415],
    offset: [80, 0],
    hebrewLabel: "כעס",
  },
  {
    type: "surprise",
    coord: [200, 415],
    offset: [-20, 0],
    hebrewLabel: "הפתעה",
  },
  {
    type: "saddness",
    coord: [615, 230],
    offset: [40, -20],
    hebrewLabel: "עצב",
  },
  {
    type: "happiness",
    coord: [200, 645],
    offset: [-20, 20],
    hebrewLabel: "אושר",
  },
  {
    type: "expectation",
    coord: [380, 230],
    offset: [40, -20],
    hebrewLabel: "ציפייה",
  },
];

var center = [0, 0];
var emotionsCount = 8;

emotionsDict.map(({ coord }) => {
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
    return emotionsDict.map(({ type, coord, offset, hebrewLabel }) => {
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

  produceEmotionsString = (emotions) => {
    var emotionsList = [];
    if (emotions.trust > 0) {
      emotionsList.push("אמון: " + parseInt(emotions.trust * 100) + "%");
    }
    if (emotions.fear > 0) {
      emotionsList.push("פחד: " + parseInt(emotions.fear * 100) + "%");
    }
    if (emotions.disgust > 0) {
      emotionsList.push("גועל: " + parseInt(emotions.disgust * 100) + "%");
    }
    if (emotions.anger > 0) {
      emotionsList.push("כעס: " + parseInt(emotions.anger * 100) + "%");
    }
    if (emotions.surprise > 0) {
      emotionsList.push("הפתעה: " + parseInt(emotions.surprise * 100) + "%");
    }
    if (emotions.saddness > 0) {
      emotionsList.push("עצב: " + parseInt(emotions.saddness * 100) + "%");
    }
    if (emotions.happy > 0) {
      emotionsList.push("אושר: " + parseInt(emotions.happy * 100) + "%");
    }
    if (emotions.expectation > 0) {
      emotionsList.push(
        "ציפייה: " + parseInt(emotions.expectation * 100) + "%"
      );
    }
    var emotionsString = emotionsList[0];
    emotionsList.map((emotion, i) => {
      if (i > 0) {
        emotionsString += i < emotionsList.length ? ", " + emotion : emotion;
      }
    });
    return emotionsString;
  };

  render() {
    const chapterDots = this.props.chapters.map(
      ({ index, headerEmotions, wordsCount }) => {
        const position = this.calculatePosition(headerEmotions);
        const activeId =
          this.props.hoverId != -1 ? this.props.hoverId : this.props.activeId;
        return (
          <circle
            className={index === activeId ? "regularDot active" : "regularDot"}
            key={"dot" + index}
            id={"dot" + index}
            cx={position[0]}
            cy={position[1]}
            r={0.01 * wordsCount}
            onMouseEnter={() => this.props.setHover(index)}
            onMouseOut={() => this.props.setHover(-1)}
            onClick={() => this.props.setActive(index)}
          />
        );
      }
    );

    return (
      <div className="emotionsMap">
        <svg
          id="diamonds"
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          height="450"
          width="960"
          viewBox={"0 100 900 850"}
        >
          <path
            className="diamond"
            d="M347.51,807.31,218.82,676.76A84.32,84.32,0,0,1,194.56,617l1.31-183.32A84.31,84.31,0,0,1,221,374.23L351.54,245.54a84.28,84.28,0,0,1,59.78-24.26l183.32,1.31a84.29,84.29,0,0,1,59.43,25.12L782.76,378.26A84.26,84.26,0,0,1,807,438l-1.31,183.31a84.29,84.29,0,0,1-25.12,59.44L650,809.48a84.3,84.3,0,0,1-59.78,24.26L407,832.43A84.34,84.34,0,0,1,347.51,807.31Z"
          />
          {this.state.emotionsLabels}
          {chapterDots}
        </svg>
      </div>
    );
  }

  calculatePosition = (emotions) => {
    var position = [center[0], center[1]];
    var counter = this.countNonZero(emotions);
    var i = 0;
    emotions.map(({ type, value }) => {
      position = this.calculatePositionForEmotion(
        position,
        value,
        emotionsDict[i].coord,
        counter
      );
      i++;
    });
    // position[0] += this.getRandomInt(10);
    // position[1] += this.getRandomInt(10);
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

  getRandomInt = (max) => {
    return Math.floor(Math.random() * max);
  };

  calculatePositionForEmotion = (position, percentage, addition, divider) => {
    if (!percentage) {
      return position;
    }
    position[0] += (percentage * (addition[0] - center[0])) / divider;
    position[1] += (percentage * (addition[1] - center[1])) / divider;
    return position;
  };
}

export default EmotionsMap;
