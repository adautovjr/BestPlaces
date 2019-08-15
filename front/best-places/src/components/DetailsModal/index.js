import React,{Component} from 'react';
import { Modal,ModalManager,Effect} from 'react-dynamic-modal';
import "./style.css";

export class DetailsModal extends Component{

    // getModalTemplate = (info) => {
    //     var template = "<div>";
    //     template += info.response.groups[0].items[0].venue.location.formattedAddress[0];
    //     template += "</div>";
    //     return template;
    // }

    render(){
        const { text,onRequestClose } = this.props;
        var info = text === "400" ? false : JSON.parse(text);
        console.log(info);
        if (info) {
            return (
                <Modal
                    onRequestClose={onRequestClose}
                    effect={Effect.SuperScaled}
                >
                    <button className="close-btn btn btn-outline-info" onClick={ModalManager.close}>x</button>
                    <div className="container-fluid main-container">
                        <div className="row no-gutters">
                            <div className="col-12">
                                <h1 className="mt-3 interests-title text-center">Pontos de interesse próximos a esse local</h1>
                            </div>
                            {/* eslint-disable-next-line array-callback-return */}
                            {info.response.groups[0].items.map( (place, key) => {
                                if (key < 10){
                                    var link = "https://www.google.com.br/maps/@"+place.venue.location.lat+","+place.venue.location.lng+",15z";
                                    return (
                                        <div className="col-12 my-2" key={key}>
                                            <div className="card place-container mx-auto p-3">
                                                <h3 className="text-center">
                                                    {place.venue.name}
                                                </h3>
                                                <div className="info-container">
                                                    <p className="text-muted">{place.venue.location.formattedAddress[0]}</p>
                                                </div>
                                                <div className="text-center">
                                                    <a className="btn btn-outline-info" href={link} target="_blank" rel="noopener noreferrer">
                                                        Ver no Maps
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                            })}

                        </div>
                    </div>
                </Modal>
            );
        } else {
            return (
                <Modal
                    onRequestClose={onRequestClose}
                    effect={Effect.SuperScaled}
                >
                    <button onClick={ModalManager.close}>x</button>
                    <h1>Não foi possível encontrar informações sobre esse lugar! :(</h1>
                </Modal>
            );
        }
    }
}

export default DetailsModal;