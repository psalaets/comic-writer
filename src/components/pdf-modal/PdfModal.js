import React from 'react';
import { PDFViewer, Document, Page, Text, View } from '@react-pdf/renderer';
import Modal from '../modal/Modal';
import Script from '../pdf/Script';

import './PdfModal.css';

export default function PdfModal(props) {
  const nodes = [
    {
      type: 'page',
      number: 1,
      panelCount: 3,
      content: [
        {
          type: 'panel',
          number: 1,
          content: [
            {
              type: 'dialogue',
              number: 1,
              speaker: 'Bob',
              modifier: 'YELL',
              content: [
                {
                  type: 'text',
                  content: 'Blah blah blah '
                },
                {
                  type: 'lettering-bold',
                  content: 'BOLD NOW'
                }
              ]
            }
          ]
        },
        {
          type: 'panel',
          number: 2,
          content: []
        }
      ]
    },
    {
      type: 'page',
      number: 2,
      panelCount: 5,
      content: [
        {
          type: 'panel',
          number: 1,
          content: []
        }
      ]
    }
  ];

  return (
    <Modal title="PDF Preview" modalActive={props.modalActive} closeButtonOnClick={props.onCloseButtonClick}>
      <PDFViewer>
        <Script nodes={nodes} />
      </PDFViewer>
    </Modal>
  );
}
