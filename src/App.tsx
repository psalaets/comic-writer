import React, { Component } from 'react';
import './App.css';

import Writer from './components/writer/Writer';
// import Stats from './components/stats/Stats';
// import ConnectedStats from './components/stats/ConnectedStats';
import Modal from './components/modal/Modal';
// import Drawer from './components/drawer/Drawer';

type AppState = {
  drawerIsOpen: boolean;
  modalActive: boolean;
  modalContent: React.ReactNode;
  modalTitle: string;
}

type ModalParts = {
  modalTitle: string;
  modalContent: React.ReactNode
}

class App extends Component<{}, AppState> {
  state: AppState;

  constructor(props: {}) {
    super(props);

    this.state = {
      modalActive: false,
      modalContent: null,
      modalTitle: '',
      drawerIsOpen: false
    };

    // Modal
    this.activateModal = this.activateModal.bind(this);
    this.deactivateModal = this.deactivateModal.bind(this);

    // Drawer
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  // Modal Handlers
  activateModal = ({ modalTitle, modalContent }: ModalParts) => () => {
    this.setState({
      modalActive: true,
      modalContent: modalContent,
      modalTitle: modalTitle
     });
  };

  deactivateModal = () => {
    this.setState({
      modalActive: false,
      modalContent: null,
      modalTitle: ''
     });
  };

  // Drawer Handlers
  toggleDrawer = () => {
    this.setState({
      drawerIsOpen: !this.state.drawerIsOpen
    })
  }

  render() {
    return (
      <>
        <div className="c-app">
          <div className="c-app__writer">
            <Writer />
          </div>
        </div>
        {this.renderModal()}
      </>
    );
  }

  renderModal() {
    if (this.state.modalActive) {
      return (
        <Modal
          closeButtonOnClick={this.deactivateModal}
          title={this.state.modalTitle}
        >
          {this.state.modalContent}
        </Modal>
      );
    } else {
      return null;
    }
  }
}

export default App;
