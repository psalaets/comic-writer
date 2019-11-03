import React from 'react';
import { Page, Text } from '@react-pdf/renderer';
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

export default function Spread({ pageCount, label, content, panelCount }) {
  const title = pageCount === 1 ? `Page ${label}` : `Pages ${label}`;

  return (
    <Page style={style}>
      <Text style={titleStyle}>{title}</Text>
      {renderNodes(content)}
    </Page>
  );
}
