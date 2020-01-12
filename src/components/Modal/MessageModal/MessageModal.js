import React from 'react';
import ReactDOM from 'react-dom';

import './MessageModal.css';

const modal = props =>

  ReactDOM.createPortal(
    <div className="modal">
      <header className="modal__header">
        <h1>{props.title}</h1>
      </header>
      <textarea className="modal__content" placeholder="Enter message" ref={props.messageRef}></textarea>
      <div className="modal__actions">
        <button name="ok" onClick={props.modalHandler}>Send</button>
        <button name="cancel" onClick={props.modalHandler}>Cancel</button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );

export default modal;
