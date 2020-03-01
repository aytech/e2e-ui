import React from 'react';
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStopCircle,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import Button from "react-bootstrap/Button";

const NodeStopModal = (props) => {
  const {
    onCancel,
    onOk,
    show
  } = props;

  return (
    <Modal show={ show } onHide={ onCancel }>
      <Modal.Header closeButton>
        <Modal.Title>Confirm stop</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Stop test? This will stop all running tests, report might be incomplete
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="warning" onClick={ onOk }>
          <FontAwesomeIcon icon={ faStopCircle }/>
          <span className="button-text">Stop</span>
        </Button>
        <Button variant="danger" onClick={ onCancel }>
          <FontAwesomeIcon icon={ faTimes }/>
          <span className="button-text">Cancel</span>
        </Button>
      </Modal.Footer>
    </Modal>
  )
};
export default NodeStopModal;