import React, { Component } from 'react';
import './App.css';

import ConnectedWriter from './components/writer/ConnectedWriter';
import ConnectedStats from './components/stats/ConnectedStats';
import StatusLine from './components/status-line/StatusLine';
import FormattingGuide from './components/formatting-guide/FormattingGuide';
import Settings from './components/settings/Settings';
import Button from './components/button/Button';
import Modal from './components/modal/Modal';
import Drawer from './components/drawer/Drawer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalActive: false,
      modalContent: false,
      modalTitle: false,
      drawerIsOpen: false
    };

    // Modal
    this.activateModal = this.activateModal.bind(this);
    this.deactivateModal = this.deactivateModal.bind(this);

    // Drawer
    this.toggleDrawer = this.toggleDrawer.bind(this);
  }

  // Modal Handlers
  activateModal = ({modalTitle, modalContent}) => () => {
    this.setState({
      modalActive: true,
      modalContent: modalContent,
      modalTitle: modalTitle
     });
  };

  deactivateModal = () => {
    this.setState({
      modalActive: false,
      modalContent: false,
      modalTitle: false
     });
  };

  // Drawer Handlers
  toggleDrawer = () => {
    this.setState({
      drawerIsOpen: !this.state.drawerIsOpen
    })
  }

  render() {
    // Hopefully this isn't stupid.
    const formattingModal = {
      modalTitle: 'Formatting Guide',
      modalContent: <FormattingGuide/>
    }
    const settingsModal = {
      modalTitle: 'Settings',
      modalContent: <Settings/>
    }

    return (
      <>
        <div className="c-app">
          <div className="c-app__writer">
            <ConnectedWriter/>
          </div>
          <div className="c-app__footer">
            <Drawer isOpen={this.state.drawerIsOpen} propagateHeight={true}>
              <ConnectedStats/>
            </Drawer>
          </div>
          <div className="c-app__status-line">
            <StatusLine.Container>
              <Button onClick={this.activateModal(formattingModal)}>Formatting Guide</Button>
              <StatusLine.Spacer/>
              <Button onClick={this.toggleDrawer} isActive={this.state.drawerIsOpen}>Insights</Button>
              <Button onClick={this.activateModal(settingsModal)}>Settings</Button>
            </StatusLine.Container>
          </div>
        </div>
        <Modal
          modalActive={this.state.modalActive}
          closeButtonOnClick={this.deactivateModal}
          title={this.state.modalTitle}
        >
          {this.state.modalContent}
        </Modal>
      </>
    );
  }
}

export default App;
