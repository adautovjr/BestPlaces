import React,{Component} from 'react';
import axios from 'axios';
import Highlighter from "react-highlight-words";
// import {Accordion, Button, Card} from 'react-bootstrap';
import "./style.css";
import { ModalManager} from 'react-dynamic-modal';
import DetailsModal from '../DetailsModal';

export class Map extends Component {
  state = {
    markers: [],
    filterTerm: ""
  };

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAL39el3Xa4MZQIQ_l9XFe4BJd-PpiiRd0&callback=initMap");
  }

  render() {
    return (
      <div className="map-container">
        <div className="row no-gutters">
          <div className="col-12 col-lg-3 aside">
              <div className="container-fluid details-container">
                <input className="card search-box" type="text" placeholder="Filtrar" onKeyUp={(e) => this.setState({filterTerm: e.target.value})}/>
                <div className="markers-list row">
                  {/* eslint-disable-next-line array-callback-return */}
                  {this.state.markers.map( (marker) => {
                    
                    var name = marker.content ? marker.content.name : "Unsaved";
                    var desc = marker.content ? marker.content.description : "Description here";
                    var id = marker.content ? marker.content.id : marker.id;
                    
                    if ( 
                      name.toLowerCase().indexOf(this.state.filterTerm.toLowerCase()) !== -1 || 
                      desc.toLowerCase().indexOf(this.state.filterTerm.toLowerCase()) !== -1 
                    ){
                      marker.setVisible(true);
                        return (
                          <div onClick={this.cardClicked.bind(this, id)} className="col-12 mb-2" key={id}>
                            <div className="card">
                              <div className="card-body">
                                <div className="card-title">
                                  <Highlighter
                                    highlightClassName="highlighted"
                                    searchWords={[this.state.filterTerm]}
                                    autoEscape={true}
                                    textToHighlight={name}
                                  />
                                </div>
                                <div className="card-subtitle-container mb-3">
                                  <Highlighter
                                    className="card-subtitle text-muted"
                                    highlightClassName="highlighted"
                                    searchWords={[this.state.filterTerm]}
                                    autoEscape={true}
                                    textToHighlight={desc}
                                  />
                                </div>
                                <div className="btn btn-success" onClick={this.fetchInfo.bind(this, marker.content ? marker.content : undefined)}>
                                  Saiba mais
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                    } else {
                      marker.setVisible(false);
                    }
                  })}
                </div>
              </div>
            </div>
          <div className="col-12 col-lg-9">
            <div id="map"></div>
          </div>
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.renderMap();
    window.initMap = this.initMap;
    window.addMarker = this.addMarker;
    window.saveCheckpoint = this.saveCheckpoint;
    window.deleteCheckpoint = this.deleteCheckpoint;
    window.markerClicked = this.markerClicked;
    window.filterMarkers = this.filterMarkers;
    window.fetchInfo = this.fetchInfo;
  }

  getPlaceInfo = async (position) => {
    var url = "https://api.foursquare.com/v2/venues/explore/";
    var client_id = "1O2AJ5U5LUSH5MR5KZ0D1AJRINNR2WKBW5S135DZGQJI3EI4";
    var client_secret = "NL2LSCUWKRF5MODUPKYOLLMJHH0GUMWW45JUVW2V5C2Q0105";
    var query = "food";
    var v = "20180819";

    var params = {
      client_id: client_id,
      client_secret: client_secret,
      query: query,
      v: v,
      ll: position
    };
    
    try {
      return await axios.get(url, { params: params } ).then(res => {
        if (res.status === 200) {
          return res.data;
        } else {
          alert("Oops.. We've had problems looking for some data.");
        }
      }).catch(error => {
        console.log(error);
        return false;
      });
    } catch (error) {
      return false;
    }


  }

  cardClicked = (id) => {
    window.infowindow.close();
    // eslint-disable-next-line array-callback-return
    let marker = this.state.markers.find(marker => {
      // console.log("marker.id", marker.id);
      // console.log("id", id);
      return marker.id === id;
    });
    // console.log(marker);
    window.map.setCenter({lat:marker.position.lat(), lng:marker.position.lng()});
    if (marker.content) {
      window.infowindow.setContent(this.getInfoWindowDetailsTemplate(marker.content));
    } else {
      window.infowindow.setContent(this.getInfoWindowInputTemplate(marker.position.lat(), marker.position.lng(), marker.id));
    }
    // eslint-disable-next-line array-callback-return
    this.state.markers.map( (marker) => {
      marker.setAnimation(null);
    });
    marker.setAnimation(window.google.maps.Animation.cn);
    setTimeout(function(){
      window.infowindow.open(window.map, marker);
    },600);
  }

  fetchInfo = async (content) => {
    console.log(content);
    var info = await this.getPlaceInfo(content.position);
    // var text = info ? JSON.stringify(info) : "400";
    info = info ? info : "400";
    // ModalManager.open(<DetailsModal text={text} onRequestClose={() => true}/>);
    if (info !== "400") {
      console.log(info);
      // eslint-disable-next-line array-callback-return
      window.infoWindow.setContent(this.updateInfoWindowTemplate(content, info.response.groups[0].items));
    }
  }

  pushMarker = (newMarker) => {
    this.setState({
      markers: [...this.state.markers, newMarker]
    });
  }

  updateMarker = (id, content) => {
    let markers = this.state.markers;
    // eslint-disable-next-line array-callback-return
    markers.map(marker => {
      if(marker.id === id){
        marker.content = content;
      }
    });
    this.setState({ ...markers });
    // console.log(this.state.markers);
  }

  saveCheckpoint = async (name, position, description, markerId) => {
    window.infowindow.close();
    window.infowindow.setContent("");
    await this.getAddress(position).then(address => { 
      var url = "http://localhost:5000/checkpoints/create";
      var place = {
        name: name,
        position: position,
        address: address,
        description: description
      };
      
      axios.post(url, { place },  { headers: { 'Content-Type': 'application/json' } }).then(res => {
        if (res.status === 201) {
          alert("Salvo com sucesso");
          // console.log("saved", res.data.place);
          this.updateMarker(markerId, res.data.place);
        } else {
          alert("Ocorreu um erro ao salvar o ponto de interesse");
        }
      });
    });
    
  }

  deleteMarker = (markerId) => {
    let markers = this.state.markers;
    
    // eslint-disable-next-line array-callback-return
    markers = this.state.markers.filter(marker => {
      if (""+marker.content.id === markerId) {
        marker.setMap(null);
      }
      return ""+marker.content.id !== markerId;
    });

    this.setState({ markers });
  }

  deleteCheckpoint = (markerId) => {
    // console.log("Delete", markerId);
    var url = "http://localhost:5000/checkpoints/delete";
    
    axios.post(url, { id: markerId },  { headers: { 'Content-Type': 'application/json' } }).then(res => {
      if (res.status === 200) {
        this.deleteMarker(markerId);
        alert(res.data.message);
      } else {
        alert("Ocorreu um erro ao deletar o ponto de interesse");
        // console.log(res.data.error);
      }
    }).catch(function (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
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
    // var brasil = {lat: -13.702797, lng:-69.6865109};
    var natal = {lat:-5.8088796, lng:-35.2299466};
    
    window.map = new window.google.maps.Map(
      document.getElementById('map'), {zoom: 13, center: natal}
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
            var position = checkpoint.coordinates.split(',');
            this.addMarker( {lat: parseFloat(position[0]),lng: parseFloat(position[1])} , checkpoint);
          });
          // console.log(this.state.markers);
        } else {
          alert("Oops.. We've had problems looking for some data.");
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  getInfoWindowInputTemplate = (lat, lng, id) => {
    return "" +
    "<input class='d-block form-control mb-2' placeholder='Nome' type='text' data-position='"+lat+","+lng+"' data-id='"+id+"' id='marker-input' />"+
    "<input class='d-block form-control mb-2' placeholder='Descrição (opcional)' type='text' id='marker-description' />"+
    "<input class='btn btn-outline-success w-100 mb-2' value='Salvar' type='button' onclick='window.saveCheckpoint(document.getElementById(&quot;marker-input&quot;).value, document.getElementById(&quot;marker-input&quot;).dataset.position, document.getElementById(&quot;marker-description&quot;).value, document.getElementById(&quot;marker-input&quot;).dataset.id)'/>"
  }

  getInfoWindowDetailsTemplate = (content) => {
    content.coordinates = content.coordinates ? content.coordinates : content.position;
    return "" +
    "<div style='width: 300px; padding: 30px'>" +
      "<h1 style='text-align: center;'>" +
        content.name +
      "</h1>" +
      "<p style='color: #6c757d;'>" +
        content.description +
      "</p>" +
      "<div id='content-container'>" +
        "<button class='btn btn-outline-info w-100 mb-2' onclick='window.fetchInfo(&quot;"+JSON.stringify(content)+"&quot;)'>" +
          "Saiba mais" +
        "</button>" +
      "</div>" + 
      "<button class='btn btn-outline-danger w-100 mb-2' onclick='window.deleteCheckpoint(&quot;"+content.id+"&quot;)'>" +
        "Delete" +
      "</button>" +
    "</div>"
  }

  updateInfoWindowTemplate = (content, items) => {
    content.coordinates = content.coordinates ? content.coordinates : content.position;
    var result = "" +
    "<div style='width: 300px; padding: 30px'>" +
      "<h1 style='text-align: center;'>" +
        content.name +
      "</h1>" +
      "<p style='color: #6c757d;'>" +
        content.description +
      "</p>" +
      "<div id='content-container' class='row no-gutters'>";
    
          // eslint-disable-next-line array-callback-return
        items.map( (place, key) => {
            if (key < 10){
              var link = "https://www.google.com.br/maps/search/"+place.venue.name+"/"+place.venue.location.lat+","+place.venue.location.lng+",15z";
              result += "" +
              "<div class='col-12 my-2'>" +
                  "<div class='card place-container mx-auto p-3'>" +
                      "<h3 class='text-center'>" +
                          place.venue.name +
                      "</h3>" +
                      "<div class='info-container'>" +
                          "<p class='text-muted'>" + place.venue.location.formattedAddress[0] + "</p>" +
                      "</div>" +
                      "<div class='text-center'>" +
                          "<a class='btn btn-outline-info' href='" + link + "' target='_blank' rel='noopener noreferrer'>" +
                              "Ver no Maps" +
                          "</a>" +
                      "</div>" +
                  "</div>" +
              "</div>";
            }
        });

    result += "</div>" + 
      "<button class='btn btn-outline-danger w-100 mb-2' onclick='window.deleteCheckpoint(&quot;"+content.id+"&quot;)'>" +
        "Delete" +
      "</button>" +
    "</div>";
    return result;
  }

  makeid = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  addMarker = (position, content=false) => {
    window.infowindow.close();

    var infoWindowContent, tempId;
    if (!content){
      tempId = this.makeid(10);
      infoWindowContent = this.getInfoWindowInputTemplate(position.lat, position.lng, tempId);
      window.infowindow.setContent(infoWindowContent);
    }

    var newMarker = new window.google.maps.Marker({position: position, map: window.map});

    newMarker.addListener('click', function(){
      window.markerClicked(newMarker);
    });
    
    if (!content){
      window.infowindow.open(window.map, newMarker);
      newMarker.id = tempId;
    } else {
      // Adds marker.id so we can use that to get info from that place
      newMarker.content = content;
      newMarker.id = content.id;
    }

    this.pushMarker(newMarker);
    // console.log(this.state.markers);
    
  }

  markerClicked = (marker) => {
    window.infowindow.close();
    window.infowindow.setContent("Loading data....");
    // eslint-disable-next-line array-callback-return
    this.state.markers.map((marker)=> {
      marker.setAnimation(null);
    });
    marker.setAnimation(window.google.maps.Animation.cn);
    if (marker.content) {
      window.infowindow.setContent(this.getInfoWindowDetailsTemplate(marker.content));
    } else {
      // console.log(marker);
      // console.log(marker.position);
      window.infowindow.setContent(this.getInfoWindowInputTemplate(marker.position.lat(), marker.position.lng(), marker.id));
    }
    setTimeout(function(){
      window.infowindow.open(window.map, marker);
    },600);
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
