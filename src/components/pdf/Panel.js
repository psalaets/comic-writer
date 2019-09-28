import React from 'react';
import { Text, View } from '@react-pdf/renderer';
import { renderNodes } from './render-pdf-content';

const style = {};

const titleStyle = {
  marginVertical: 12,
  fontFamily: 'Helvetica-Bold'
};

export default function Panel({ number, content }) {
  return (
    <View style={style}>
      <Text style={titleStyle}>Panel {number}</Text>
      {renderNodes(content)}
    </View>
  );
}
