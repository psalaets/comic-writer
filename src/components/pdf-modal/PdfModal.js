import React from 'react';
import Modal from '../modal/Modal';

import { PDFViewer, Document, Page, Text, View } from '@react-pdf/renderer';

import './PdfModal.css';

export default function PdfModal(props) {
  return (
    <Modal title="PDF Preview" modalActive={props.modalActive} closeButtonOnClick={props.onCloseButtonClick}>
      <PDFViewer>
        <Document>
          <Page>
            <Text>test 1</Text>
          </Page>
          <Page>
            <Text>test 2</Text>
          </Page>
        </Document>
      </PDFViewer>
    </Modal>
  );
}
