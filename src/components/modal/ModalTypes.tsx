import React from 'react';
import FormattingGuide from '../formatting-guide/FormattingGuide';
import Settings from '../settings/Settings';

const ModalTypes = {
  formattingGuide: {
    modalTitle: 'Formatting Guide',
    modalContent: <FormattingGuide/>
  },
  settingsModal: {
    modalTitle: 'Settings',
    modalContent: <Settings/>
  }
}

export default ModalTypes
