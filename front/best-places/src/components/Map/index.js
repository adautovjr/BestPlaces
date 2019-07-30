import React,{Component} from 'react';
import "./style.css";

export class Map extends Component {
  state = {
    markers: []
  };

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAL39el3Xa4MZQIQ_l9XFe4BJd-PpiiRd0&callback=initMap");
  }

  render() {
    return (
      <div className="map-container">
        <div id="map"></div>
      </div>
    );
  }

  componentDidMount() {
    this.renderMap();
    window.initMap = this.initMap;
  }

  initMap = () => {
    // The location of Uluru
    var uluru = {lat: -25.344, lng: 131.036};
    // The map, centered at Uluru
    window.map = new window.google.maps.Map(
        document.getElementById('map'), {zoom: 4, center: uluru});
    // The marker, positioned at Uluru
    var marker = new window.google.maps.Marker({position: uluru, map: window.map});
    this.state.markers.push(marker);
    this.addListener();
    console.log(this.state.markers);
  }

  addListener = () => {
    window.google.maps.event.addListener(window.map, 'click', function(event){
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      new window.google.maps.Marker({position: {lat: lat, lng: lng}, map: window.map});
    });
  }


}

function loadScript(url) {
  var index = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script")
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}


export default Map;
