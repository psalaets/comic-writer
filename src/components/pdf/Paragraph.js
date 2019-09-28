import React from 'react';
import { Text } from '@react-pdf/renderer';

const style = {};

export default function Paragraph({ content }) {
  return <Text style={style}>{content}</Text>;
}
