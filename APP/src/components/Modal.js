import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const portalRoot = document.getElementById('portal-root');

const UIModal = ({children, isOpen, onClickClose, extendido, reduzido, data}) => {
    if(!isOpen){
        return null;
    }

    
    return ReactDOM.createPortal(
        <div className='ui-modal_overlay'>
            {reduzido ? 
                <div className='ui-modal-reduzido'>
                <button type='button' className='ui-modal__close_button' onClick={onClickClose}>X</button>
                {children}
                </div>
            : extendido ?
                <div className='ui-modal-extendido'>
                <button type='button' className='ui-modal__close_button' onClick={onClickClose}>X</button>
                {children}
                </div>
            : data ?
                <div className='ui-modal-data'>
                <button type='button' className='ui-modal__close_button' onClick={onClickClose}>X</button>
                {children}
                </div>
            :
                <div className='ui-modal'>
                <button type='button' className='ui-modal__close_button' onClick={onClickClose}>X</button>
                {children}
                </div>
            }
        </div>,
        portalRoot
    )
};

export default UIModal;