import React from 'react';
import { Document } from '@react-pdf/renderer';
import { renderNodes } from './render-pdf-content';

export default function Script({ nodes }) {
  return (
    <Document>
      {renderNodes(nodes)}
    </Document>
  );
}
