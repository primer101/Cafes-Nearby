import React, { Component } from "react";
import { push as Menu } from "react-burger-menu";
import PropTypes from "prop-types";
require("./slide.css");

export default class Slide extends Component {
  static propTypes = {
    markers: PropTypes.array.isRequired,
    places: PropTypes.array.isRequired
  };

  openInfo = locationId => {
    this.props.markers.forEach(marker => {
      if (marker.id === locationId) {
        window.google.maps.event.trigger(marker, "click");
      }
    });
  };

  render() {
    const { places } = this.props;
    return (
      <Menu noOverlay pageWrapId={"App-main-content"} outerContainerId={"App"}>
        {places.length < 1 && (
          <div className="theList" aria-label="List of Venues">
            No results
          </div>
        )}

        {places.length > 0 && (
          <div className="theList" aria-label="List of Venues">
            <ul className="menu-result">
              {places.map((place, index) => (
                <li
                  role="menuitem"
                  onClick={() => {
                    this.openInfo(place.id);
                  }}
                  aria-label={place.name}
                  tabIndex="0"
                  id={place.id}
                  key={place.id}
                >
                  <span>{`${(++index).toString()} `}</span>
                  <b>{place.name}</b>
                  <br />
                  <i>{place.location.address}</i>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Menu>
    );
  }
}
