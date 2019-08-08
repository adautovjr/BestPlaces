import React,{Component} from 'react';
import { Modal,ModalManager,Effect} from 'react-dynamic-modal';
 
export class DetailsModal extends Component{
    render(){
        const { text,onRequestClose } = this.props;
        return (
            <Modal
                onRequestClose={onRequestClose}
                effect={Effect.SuperScaled}
            >
                <button onClick={ModalManager.close}>x</button>
                <h1>{text}</h1>
            </Modal>
        );
    }
}

export default DetailsModal;