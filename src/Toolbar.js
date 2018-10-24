import React, { Component } from "react";
import SearchInput from "react-search-input";
import PropTypes from "prop-types";
require("./toolbar.css");

export default class ToolBar extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="toolbar">
        <form className="toolbar-form">
          <div>
            <SearchInput
              {...this.props}
              className="search-input"
              aria-label="Search Cafes"
              // className="toolbar-search-input"
              ref="autocomplete"
              type="text"
              placeholder="Enter a location"
            />
          </div>
          {/* <div className="fours-right">
            <i>Powered by Foursquare</i>
          </div> */}
        </form>
      </div>
    );
  }
}
