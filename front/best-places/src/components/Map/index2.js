import React,{Component} from 'react'
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
 
export class MapContainer extends Component {
  render() {
    return (
      <Map 
        google={this.props.google} 
        zoom={16}
        initialCenter={{
            lat: -5.8335189,
            lng: -35.2255331
          }}
        >
        <Marker onClick={this.onMarkerClick}
                name={'Current location'} />
 
        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              {/* <h1>{this.state.selectedPlace.name}</h1> */}
            </div>
        </InfoWindow>
      </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: ('AIzaSyCPE_0srgytD-jZEv6S5R0xKiEDzYmqSxg')
})(MapContainer)