import React, { Component } from 'react';
import './App.css';

import ConnectedWriter from './components/writer/ConnectedWriter';
import Stats from './components/stats/Stats';
import ConnectedStats from './components/stats/ConnectedStats';
import MenuBar from './components/menu-bar/MenuBar';
import Button from './components/button/Button';
import Modal from './components/modal/Modal';
import Drawer from './components/drawer/Drawer';
import ModalTypes from './components/modal/ModalTypes'


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
    return (
      <>
        <div className="c-app">
          <div className="c-app__menu-bar">
            <MenuBar.Container primary>
              <h1 className="u-font-size--maria">Comic Writer <sup aria-hidden="true" className="u-font-size--saya">αlρhα</sup></h1>
              <MenuBar.Spacer/>
              <Button onClick={this.activateModal(ModalTypes.formattingGuide)} transparent>Guide</Button>
              <Button onClick={this.toggleDrawer} isActive={this.state.drawerIsOpen} transparent>Insights</Button>
              {/*<Button onClick={this.activateModal(ModalTypes.settingsModal)}>Settings</Button>*/}
            </MenuBar.Container>
          </div>
          <div className="c-app__writer">
            <ConnectedWriter/>
          </div>
          <div className="c-app__footer">
            <Drawer title="Insights" isOpen={this.state.drawerIsOpen} propagateHeight={true}>
              <Stats>
                <ConnectedStats.PageCount/>
                <ConnectedStats.DialougeLength/>
                <ConnectedStats.PageHistogram/>
              </Stats>
            </Drawer>
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
