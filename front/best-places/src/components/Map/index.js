import React,{Component} from 'react';
import axios from 'axios';
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
      <div className="map-container row">
        <div className="col-12 col-lg-3">
          <div className="row">
            <div className="col-12 search-box-container">
              <input type="search" className="search-box" />
            </div>
            <div className="col-12">
              <input type="submit" onClick={this.saveCheckpoints} />
            </div>
            <div className="markers-list">
              {this.state.markers.map( (marker) => {
                return (
                  <div>
                    <h1>{marker.name}</h1>
                  </div>
                )
              })}
            </div>
          </div>
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
    window.pushMarker = this.pushMarker;
    window.addMarker = this.addMarker;
    window.saveCheckpoint = this.saveCheckpoint;
    window.markerClicked = this.markerClicked;
  }

  pushMarker = (newMarker) => {
    this.state.markers.push(newMarker);
  }

  saveCheckpoint = (name, position) => {
    window.infowindow.close();
    window.infowindow.setContent("");
    var address = this.getAddress(position).then(data => { return data });
    var url = "http://localhost:5000/checkpoints/create";
    var place = {
      name: name,
      position: position,
      address: "teste",
      description: "Teste"
    };
    var headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    };
    axios.post(url, { place },  {
      headers: headers
    }).then(res => {
      if (res.status === 200) {
        alert(res.data.message);
      } else {
        alert("Paw");
      }
    });
  }

  getAddress = (position) => {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+position+"&key=AIzaSyAL39el3Xa4MZQIQ_l9XFe4BJd-PpiiRd0"
    
    var address = "";

    return axios.get(url).then(res => {
      if (res.status === 200) {
        if (res.data.results.length !== 0){
          address = res.data.results[0].formatted_address;
          return address;
        } else {
          address = "No address found";
          return address;
        }
      } else {
        alert("Oops.. We've had problems looking for some data.");
      }
    });

  }

  initMap = () => {
    // The location of Uluru
    var australia = {lat: -25.344, lng: 131.036};
    var brasil = {lat: -13.702797, lng:-69.6865109};
    
    window.map = new window.google.maps.Map(
      document.getElementById('map'), {zoom: 4, center: brasil}
    );

    window.infowindow = new window.google.maps.InfoWindow({
      content: ''
    });

    this.fetchMarkers();

    this.addMapListener();
  }

  fetchMarkers = () => {
    var reqUrl = 'http://localhost:5000/checkpoints/json';

    try {
      axios.get(reqUrl).then(res => {
        if (res.status === 200){
          var checkpoints = res.data.checkpoints;
          // eslint-disable-next-line array-callback-return
          checkpoints.map((checkpoint) => {
            this.pushMarker(checkpoint);
            var position = checkpoint.coordinates.split(',');
            console.log(this.state.markers);
            this.addMarker( {lat: parseFloat(position[0]),lng: parseFloat(position[1])} , checkpoint);
          });
        } else {
          alert("Oops.. We've had problems looking for some data.");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  addMarker = (position, content=false) => {
    window.infowindow.close();

    var infoWindowContent;
    if (content){
      infoWindowContent = "Olá "+content.name;
    } else {
      infoWindowContent = "<input type='text' data-position='"+position.lat+","+position.lng+"' id='marker-input' />"+
      "<input value='Salvar' type='button' onclick='window.saveCheckpoint(document.getElementById(&quot;marker-input&quot;).value, document.getElementById(&quot;marker-input&quot;).dataset.position)'/>";
    }
    window.infowindow.setContent(infoWindowContent);

    var newMarker = new window.google.maps.Marker({position: position, map: window.map});

    newMarker.addListener('click', function(){
      window.markerClicked(newMarker);
    });
    
    if (!content){
      window.infowindow.open(window.map, newMarker);
    }

    // window.pushMarker(newMarker);
  }

  markerClicked = (marker) => {
    window.infowindow.setContent("Loading data....");
    window.infowindow.open(window.map, marker);
  }

  addMapListener = () => {
    window.google.maps.event.addListener(window.map, 'click', function(event){

      var lat = event.latLng.lat();
      var lng = event.latLng.lng();
      
      window.addMarker({lat: lat, lng: lng});

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
