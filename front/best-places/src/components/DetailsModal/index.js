import React,{Component} from 'react';
import { Modal,ModalManager,Effect} from 'react-dynamic-modal';
 
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
                    <button onClick={ModalManager.close}>x</button>
                    <h1>Pontos de interesse</h1>
                    {/* eslint-disable-next-line array-callback-return */}
                    {info.response.groups[0].items.map( (place, key) => {
                        if (key < 10){
                            return (
                                <h6 key={key}>{place.venue.name}</h6>
                            )   
                        }
                    })}
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