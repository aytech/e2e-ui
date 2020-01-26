import React, { Component } from 'react';
import { connect } from "react-redux";
import Modal from "react-bootstrap/Modal";
import { updateSettingsModalStatus } from "../../actions/stateActions";
import './settings.css';

class Settings extends Component {

  onHide = () => {
    this.props.updateSettingsModalStatus(false);
  };

  render() {
    const {
      isSettingsModalOpen
    } = this.props.state;

    return (
      <Modal
        show={ isSettingsModalOpen }
        dialogClassName="modal-90w"
        aria-labelledby="settings-page"
        onHide={ this.onHide }>
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            User settings
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Ipsum molestiae natus adipisci modi eligendi? Debitis amet quae unde
            commodi aspernatur enim, consectetur. Cumque deleniti temporibus
            ipsam atque a dolores quisquam quisquam adipisci possimus
            laboriosam. Quibusdam facilis doloribus debitis! Sit quasi quod
            accusamus eos quod. Ab quos consequuntur eaque quo rem! Mollitia
            reiciendis porro quo magni incidunt dolore amet atque facilis ipsum
            deleniti rem!
          </p>
        </Modal.Body>
      </Modal>
    )
  }
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateSettingsModalStatus: (status) => dispatch(updateSettingsModalStatus(status))
});

export default connect(mapStateToProps, mapDispatchToProps)(Settings);