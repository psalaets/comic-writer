import React, { Component } from 'react';
import './App.css';

import ConnectedWriter from './components/writer/ConnectedWriter';
import Stats from './components/stats/Stats';
import ConnectedStats from './components/stats/ConnectedStats';
import MenuBar from './components/menu-bar/MenuBar';
import TopBar from './components/top-bar/TopBar';
import Button from './components/button/Button';
import Modal from './components/modal/Modal';
import Drawer from './components/drawer/Drawer';
import ModalTypes from './components/modal/ModalTypes'

import PdfModal from './components/pdf-modal/PdfModal';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalActive: false,
      modalContent: false,
      modalTitle: false,
      drawerIsOpen: false,
      pdfModalActive: false
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

  togglePdfModal = () => {
    this.setState(state => {
      return {
        pdfModalActive: !state.pdfModalActive
      };
    })
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
            <TopBar
              onGuideClick={this.activateModal(ModalTypes.formattingGuide)}
              onInsightsClick={this.toggleDrawer}
              onPdfClick={null}
              drawerOpen={this.state.drawerIsOpen}
            />
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
        <PdfModal modalActive={this.state.pdfModalActive} onCloseButtonClick={this.togglePdfModal}/>
      </>
    );
  }
}

export default App;
