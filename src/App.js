import React, { Component } from 'react';
import './App.css';

import ConnectedWriter from './components/writer/ConnectedWriter';
import StatusLine from './components/status-line/StatusLine';
import FormattingGuide from './components/formatting-guide/FormattingGuide';
import Button from './components/button/Button';
import Modal from './components/modal/Modal';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalActive: true
    };

    this.activateModal = this.activateModal.bind(this);
    this.deactivateModal = this.deactivateModal.bind(this);
  }

  activateModal = () => {
    this.setState({ modalActive: true });
  };

  deactivateModal = () => {
    this.setState({ modalActive: false });
  };


  render() {
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
        <Modal
          modalActive={this.state.modalActive}
          closeButtonOnClick={this.deactivateModal}
          title="Formatting Guide"
        >
          <FormattingGuide/>
        </Modal>
      </>
    );
  }
}

export default App;
