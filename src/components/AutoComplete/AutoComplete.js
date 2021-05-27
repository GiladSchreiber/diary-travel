import React from "react";
import "./AutoComplete.scss";
import Autosuggest from "react-autosuggest";

const searchWords = require("../../data/searchDict.json");

function getSuggestions(value) {
  const regex = new RegExp("^" + value, "i");

  return searchWords
    .filter((searchWord) => regex.test(searchWord.display))
    .slice(0, 8);
}

function getSuggestionValue(suggestion) {
  return suggestion.display;
}

function renderSuggestion(suggestion) {
  return <span>{suggestion.display}</span>;
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
      suggestions: getSuggestions(value),
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: searchWords.map(({ display }) => {
        return display;
      }),
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
