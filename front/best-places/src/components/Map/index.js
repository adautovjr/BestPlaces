import React,{Component} from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 
export class MapContainer extends Component {
  state = {
    markers: [],
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  render() {
    return (
      <Map 
        google={this.props.google} 
        zoom={16}
        onClick={this.onMapClicked}
        initialCenter={{
            lat: -5.8335189,
            lng: -35.2255331
          }}
        >
        
        {this.state.markers.map(
          marker => (
            <Marker onClick={this.onMarkerClick}
                key={marker.id}
                name={marker.name} 
                position={marker.position} />
          )
        )}
 
        <InfoWindow onClose={this.onInfoWindowClose}
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
              </div>
        </InfoWindow>
      </Map>
    );
  }

  checkMarkers() {
    this.setState({markers: this.state.markers.filter(function(marker) { 
      return marker.name !== undefined 
    })});
  }

  setInfoWindowVisible() {
    
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    }
  );

  onMapClicked = (props, meta, click) => {
    this.checkMarkers();
    
    var min = 1;
    var max = 100000;
    var key = min + Math.random() * (max - min);
    
    var newMarker = {id: key, position:{lat: click.latLng.lat(), lng: click.latLng.lng()}};

    this.state.markers.push(
      newMarker
    );

    console.log('Markers:', this.state.markers);

    this.forceUpdate();
  };


}

 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyCPE_0srgytD-jZEv6S5R0xKiEDzYmqSxg')
})(MapContainer)