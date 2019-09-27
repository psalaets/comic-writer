import React from 'react';
import { Page as PdfPage, Text, View } from '@react-pdf/renderer';
import { renderNodes } from './render-pdf-content';

const style = {
  paddingTop: 35,
  paddingBottom: 65,
  paddingHorizontal: 35,
};

export default function Page({ number, content, panelCount }) {
  return (
    <PdfPage style={style}>
      <Text>Page {number}</Text>
      {renderNodes(content)}
    </PdfPage>
  )
}
