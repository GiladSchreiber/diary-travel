import React from "react";
import "./AutoComplete.scss";
import Autosuggest from "react-autosuggest";

const searchWords = require("../../data/search_list.json").words;

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

  getSuggestions(value) {
    console.log(value);
    if (!value) {
      return Object.keys(searchWords).slice(0, 8);
    }
    const regex = new RegExp("^" + value, "i");
    return Object.keys(searchWords)
      .filter((searchWord) => regex.test(searchWord))
      .slice(0, 8);
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue,
      activeIcon: false,
    });
  };

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
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

  sholeRenderSuggestions = () => {
    return true;
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
          shouldRenderSuggestions={this.sholeRenderSuggestions}
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
