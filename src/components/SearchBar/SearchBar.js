import React from "react";
import "./SearchBar.scss";

class SearchBar extends React.Component {
  textChanged(e) {
    this.setState({
      text: e.target.value,
    });
  }

  render() {
    return (
      <div className={"searchContainer"}>
        <div
          className={"searchIcon"}
          onClick={() => this.props.onSearch(this.state.text)}
        >
          <i className="fas fa-search fa-md"></i>
        </div>
        <input
          type="text"
          className="search"
          value={this.props.searchWord}
          onChange={(e) => this.textChanged(e)}
        ></input>
      </div>
    );
  }
}

export default SearchBar;
