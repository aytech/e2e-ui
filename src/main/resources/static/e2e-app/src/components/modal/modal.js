import React from 'react';
import { Modal } from "react-bootstrap";

const ModalDialog = (props) => {
  const {
    show,
    title,
    body,
    onCancel,
    onOk,
    actionText
  } = props;

  return (
    <Modal show={ show } onHide={ onCancel }>
      <Modal.Header closeButton>
        <Modal.Title>{ title }</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{ body }</p>
      </Modal.Body>

      <Modal.Footer>
        <button type="button" className="btn btn-primary" onClick={ onOk }>
          <div className="fa-sm">
            <i className="fas fa-stop-circle visible"/>
            <span className="button-text">{ actionText }</span>
          </div>
        </button>
        <button type="button" className="btn btn-secondary" onClick={ onCancel }>
          <div className="fa-sm">
            <i className="fas fa-times visible"/>
            <span className="button-text">Cancel</span>
          </div>
        </button>
      </Modal.Footer>
    </Modal>
  )
};

export default ModalDialog;