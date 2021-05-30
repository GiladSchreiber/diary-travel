import React from "react";
import "./AutoComplete.scss";
import Autosuggest from "react-autosuggest";

const categoriesData = require("../../data/searchCategories.json");

function getSuggestionValue(suggestion) {
  return suggestion;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion}</span>;
}

class AutoComplete extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: [],
      activeIcon: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.category !== this.props.category) {
      this.setState({ value: "" });
    }
  }
  getSuggestions(value) {
    const regex = new RegExp("^" + value, "i");
    console.log("suggestion is ", this.props.category);
    return Object.keys(categoriesData[this.props.category])
      .filter((searchWord) => regex.test(searchWord))
      .slice(0, 5);
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
      activeIcon: false,
    });
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("key pressed");
      this.props.onSearch(this.state.text);
      this.setState({
        activeIcon: true,
      });
    }
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    this.props.onSearch(getSuggestionValue(suggestion));
    this.setState({
      activeIcon: true,
    });
  };

  handleSearchClick = () => {
    this.props.onSearch(this.state.value);
    this.setState({
      activeIcon: true,
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "חיפוש",
      value,
      onChange: this.onChange,
    };

    const searchClass = this.state.activeIcon ? " active" : "";

    return (
      <div className="autoCompleteContainer">
        <div
          className={"searchIcon" + searchClass}
          onClick={this.handleSearchClick}
        >
          <i className="fas fa-search fa-sm"></i>
        </div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          onSuggestionSelected={this.onSuggestionSelected}
          highlightFirstSuggestion={true}
          inputProps={inputProps}
        />
      </div>
    );
  }
}

export default AutoComplete;
