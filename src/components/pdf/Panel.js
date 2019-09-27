import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { renderNodes } from './render-pdf-content';

const style = {};

export default function Panel({ number, content }) {
  return (
    <View style={style}>
      <Text>Panel {number}</Text>
      {renderNodes(content)}
    </View>
  );
}
