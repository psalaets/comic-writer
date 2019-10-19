import React from 'react';
import { Page as PdfPage, Text } from '@react-pdf/renderer';
import { renderNodes } from './render-pdf-content';

const style = {
  paddingTop: 35,
  paddingBottom: 65,
  paddingHorizontal: 35,
};

const titleStyle = {
  marginVertical: 12,
  fontFamily: 'Helvetica-Bold',
  textDecoration: 'underline'
};

export default function Page({ number, content, panelCount }) {
  return (
    <PdfPage style={style}>
      <Text style={titleStyle}>Page {number}</Text>
      {renderNodes(content)}
    </PdfPage>
  )
}
