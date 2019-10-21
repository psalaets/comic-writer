import React from 'react';
import { Page } from '@react-pdf/renderer';
import { renderNodes } from './render-pdf-content';

const style = {};

export default function FrontPage({ content }) {
  if (content.length > 0) {
    return (
      <Page style={style}>
        {renderNodes(content)}
      </Page>
    );
  } else {
    return null;
  }
}
