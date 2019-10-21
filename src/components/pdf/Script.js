import React from 'react';
import { Document } from '@react-pdf/renderer';
import { renderScriptPages } from './render-pdf-content';

export default function Script({ nodes }) {
  return (
    <Document>
      {renderScriptPages(nodes)}
    </Document>
  );
}
