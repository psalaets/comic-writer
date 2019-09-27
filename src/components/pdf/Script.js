import React from 'react';
import { Document, Text, View } from '@react-pdf/renderer';
import * as types from '../../types';
import { renderNodes } from './render-pdf-content';

export default function Script({ nodes }) {
  return (
    <Document>
      {renderNodes(nodes)}
    </Document>
  );
}
