import React from 'react';
import { Text } from '@react-pdf/renderer';

export default function Paragraph({ content }) {
  return <Text>{content}</Text>;
}
