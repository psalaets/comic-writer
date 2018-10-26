import React, { Component } from 'react';
import './App.css';

import ConnectedWriter from './components/writer/ConnectedWriter';
import StatusLine from './components/status-line/StatusLine';
import Button from './components/button/Button';
import ModalBody from './components/modal-body/ModalBody';
import Modal from 'react-aria-modal';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formattingModalActive: false
    };

    this.activateModal = this.activateModal.bind(this);
    this.deactivateModal = this.deactivateModal.bind(this);
    this.getApplicationNode = this.getApplicationNode.bind(this);
  }

  activateModal = () => {
    this.setState({ formattingModalActive: true });
  };

  deactivateModal = () => {
    this.setState({ formattingModalActive: false });
  };

  getApplicationNode = () => {
    return document.getElementById('app');
  };

  render() {
    const formattingModal = this.state.formattingModalActive ? <Modal
      titleText="Formatting Guide"
      onExit={this.deactivateModal}
      initialFocus="#close-formatting-modal"
      getApplicationNode={this.getApplicationNode}
      dialogClass="c-modal__dialouge"
      underlayClass="c-modal"
    >
      <ModalBody
        title="Formatting Guide"
        closeButtonOnClick={this.deactivateModal}
        closeButtonId="close-formatting-modal"
      >
        
      </ModalBody>
    </Modal> : false;

    return (
      <>
        <div className="c-app">
          <div className="c-app__writer">
            <ConnectedWriter />
          </div>
          <div className="c-app__status-line">
            <StatusLine>
              <Button onClick={this.activateModal}>Formatting Help</Button>
            </StatusLine>
          </div>
        </div>
        {formattingModal}
      </>
    );
  }
}

export default App;
