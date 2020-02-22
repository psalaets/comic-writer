import React, { Component } from 'react';
import './App.css';

import ConnectedWriter from './components/writer/ConnectedWriter';
import Stats from './components/stats/Stats';
import ConnectedStats from './components/stats/ConnectedStats';
import ConnectedTopBar from './components/top-bar/ConnectedTopBar';
import Modal from './components/modal/Modal';
import Drawer from './components/drawer/Drawer';
import ModalTypes from './components/modal/ModalTypes'

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
          <div className="c-app__menu-bar">
            <ConnectedTopBar
              onGuideClick={this.activateModal(ModalTypes.formattingGuide)}
              onInsightsClick={this.toggleDrawer}
              drawerOpen={this.state.drawerIsOpen}
            />
          </div>
          <div className="c-app__writer">
            <ConnectedWriter/>
          </div>
          <div className="c-app__footer">
            {/* <Drawer title="Insights" isOpen={this.state.drawerIsOpen} propagateHeight={true}>
              <Stats>
                <ConnectedStats.PageCount/>
                <ConnectedStats.DialougeLength/>
                <ConnectedStats.PageHistogram/>
              </Stats>
            </Drawer> */}
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
