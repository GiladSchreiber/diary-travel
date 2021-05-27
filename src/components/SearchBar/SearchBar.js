import React from "react";
import "./SearchBar.scss";

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      activeIcon: false,
    };
  }

  textChanged(e) {
    this.setState({
      text: e.target.value,
      activeIcon: false,
    });
  }

  handleKeyPress = (event) => {
    if (event.key === "Enter") {
      this.props.onSearch(this.state.text);
      this.setState({
        activeIcon: true,
      });
    }
  };

  handleSearchClick = () => {
    this.props.onSearch(this.state.text);
    this.setState({
      activeIcon: true,
    });
  };

  render() {
    const searchClass = this.state.activeIcon ? " active" : "";
    return (
      <div className={"searchContainer"}>
        <div
          className={"searchIcon" + searchClass}
          onClick={this.handleSearchClick}
        >
          <i className="fas fa-search fa-md"></i>
        </div>
        <input
          type="text"
          className="search"
          value={this.state.text}
          onChange={(e) => this.textChanged(e)}
          onKeyPress={this.handleKeyPress}
        ></input>
      </div>
    );
  }
}

export default SearchBar;
