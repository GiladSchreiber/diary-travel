import React from "react";
import "./Categories.scss";
import Dropdown from "react-dropdown";

const searchTypes = [
  { value: "words", label: "מילה" },
  { value: "places", label: "מקום" },
  { value: "emotions", label: "רגש" },
  { value: "artists", label: "אומן" },
];
const defaultOption = searchTypes[0];

const arrowClosed = <span className="arrow-closed" />;
const arrowOpen = <span className="arrow-open" />;

class Categories extends React.Component {
  constructor() {
    super();

    this.state = {
      selected: defaultOption,
    };

    this.onSelect = this.onSelect.bind(this);
  }

  onSelect = (option) => {
    this.setState({ selected: option });
    this.props.setCategory(option.value);
  };

  render() {
    return (
      <div className="categoriesContainer">
        <Dropdown
          arrowClosed={arrowClosed}
          arrowOpen={arrowOpen}
          placeholderClassName="dropDownPlaceHolder"
          controlClassName="dropDownControl"
          menuClassName="dropDownMenu"
          options={searchTypes}
          onChange={this.onSelect}
          value={this.state.selected}
          placeholder={defaultOption}
        />
      </div>
    );
  }
}

export default Categories;
