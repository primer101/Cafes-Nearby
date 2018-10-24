import React, { Component } from "react";
// import logo from './logo.svg';
import "./App.css";
import Header from "./Header";
import ToolBar from "./Toolbar";
import { getData } from "./lib/getData";
import Map from "./Map";
import Footer from "./Footer";
import Slide from "./Slide";
import { createFilter } from "react-search-input";

const END_POINT_EXPLORE = "https://api.foursquare.com/v2/venues/explore";
// const END_POINT_DETAIL = "https://api.foursquare.com/v2/venues/";

const SOHO_NY = {
  lat: 40.7243,
  lng: -74.0018
};

const KEYS_TO_FILTERS = [
  "name",
  "location.address",
  "location.city",
  "location.postalCode"
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      filteredPlaces: [],
      markers: [],
      query: "cafe",
      searchTerm: ""
    };
  }

  componentDidMount() {
    getData(END_POINT_EXPLORE, {
      limit: 15,
      ll: `${SOHO_NY.lat},${SOHO_NY.lng}`,
      query: this.state.query
    })
      .then(data => {
        const venues = data.response.groups[0].items.map(item => item.venue);
        this.setState(
          {
            places: venues || [],
            filteredPlaces: venues || []
          },
          () => {
            console.log("App state changed: ", this.state);
            this.loadGoogleMapAPI();
          }
        );
        console.log(venues);
      })
      .catch(error => {
        console.log("Error: " + error);
      });
  }

  // Lazy load the Google Map API
  loadGoogleMapAPI = () => {
    const refScript = window.document.getElementsByTagName("script")[0];
    const script = window.document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyAkUguQ-B0QLbbOymXiRYv4f6LT429zS04&callback=initMap";
    script.async = true;
    script.defer = true;
    refScript.parentNode.insertBefore(script, refScript);
    script.onerror = function() {
      alert("Error, Google Map couldn't be loaded!");
    };
    window.initMap = this.initMap;
  };

  makeMarkers(places, map) {
    const infoWindow = new window.google.maps.InfoWindow({
      maxWidth: 200,
      height: 100
    });
    this.infoWindow = infoWindow;
    const result = [];

    places.forEach((venue, index) => {
      //create marker
      const marker = new window.google.maps.Marker({
        position: venue.location,
        map: map,
        id: venue.id,
        label: (++index).toString(),
        animation: window.google.maps.Animation.DROP,
        title: venue.name
      });

      // Click on a marker, animation starts and infoWindow opens
      marker.addListener("click", function() {
        infoWindow.setContent(`
                                  <h2>${venue.name}</h2>
                                  <p>Address:${venue.location.address}
                                              ${
                                                venue.location
                                                  .formattedAddress[1]
                                              }
                                  </p>
                                  <p> ${'<a href="https://foursquare.com/v/' +
                                    venue.id +
                                    '" target="_blank">Read More on <b>Foursquare</b></a>'} </p>
                                   <br><i>Info provided by Foursquare.</i>
                                  `);

        //make the marker bounce for a short time then it stops
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        window.setTimeout(function() {
          marker.setAnimation(null);
        }, 1000);

        infoWindow.open(map, marker);
      });

      //stop marker animation and close infoWindow when map is clicked
      map.addListener("click", function() {
        marker.setAnimation(null);
        infoWindow.close(map, marker);
      });
      result.push(marker);
    });
    return result;
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: SOHO_NY,
      zoom: 16
    });
    this.map = map;
    this.setState({ markers: this.makeMarkers(this.state.places, map) });
  };

  onSearchUpdated = term => {
    this.setState(
      {
        searchTerm: term,
        filteredPlaces: this.state.places.filter(
          createFilter(this.state.searchTerm, KEYS_TO_FILTERS)
        )
      },
      () => {
        this.state.markers.forEach(item => item.setMap(null));
        this.setState({
          markers: this.makeMarkers(this.state.filteredPlaces, this.map)
        });
      }
    );
  };

  render() {
    return (
      <div id="App" className="App">
        <Slide
          places={this.state.filteredPlaces}
          markers={this.state.markers}
        />
        <header className="App-header">
          <Header />
        </header>
        <main id="App-main-content" className="App-main-content">
          <ToolBar
            onChange={this.onSearchUpdated}
            value={this.state.searchTerm}
          />
          <Map />
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
