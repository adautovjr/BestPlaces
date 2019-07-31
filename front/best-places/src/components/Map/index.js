import React,{Component} from 'react';
import "./style.css";

export class Map extends Component {
  static state = {
    markers: []
  };

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAL39el3Xa4MZQIQ_l9XFe4BJd-PpiiRd0&callback=initMap");
  }

  render() {
    return (
      <div className="map-container row">
        <div className="col-12 col-lg-3">
          Alou
        </div>
        <div className="col-12 col-lg-9">
          <div id="map"></div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.renderMap();
    window.initMap = this.initMap;
    window.saveCheckpoint = this.saveCheckpoint;
  }

  saveCheckpoint = (name) => {
    console.log("alou, "+name);
  }

  static addMarker = (position) => {
    if (window.infowindow){
      window.infowindow.close();
    }
    var marker = new window.google.maps.Marker({position: position, map: window.map});
    Map.state.markers.push(marker);

    window.infowindow = new window.google.maps.InfoWindow({
      content: "Uluru"
    });
    window.infowindow.open(window.map, marker);

    console.log("Markers:", Map.state.markers);
  }

  initMap = () => {
    // The location of Uluru
    var uluru = {lat: -25.344, lng: 131.036};
    // The map, centered at Uluru
    window.map = new window.google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: uluru}
    );
    this.addListener();
  }


  addListener = () => {
    window.google.maps.event.addListener(window.map, 'click', function(event){
      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      Map.addMarker({ lat: lat, lng: lng });
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
