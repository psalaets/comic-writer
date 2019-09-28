import React from 'react';
import { Text, View } from '@react-pdf/renderer';

const style = {
  paddingLeft: 35
};
const boldStyle = {
  fontFamily: 'Helvetica-Bold',
  textDecoration: 'underline'
};

export default function Lettering({ number, subject, modifier, content }) {
  const leftSide = `${number}. ${renderSubject(subject)}${renderModifier(modifier)}`
  const rightSide = renderContent(content);

  return (
    <View style={style}>
      <Text>
        {leftSide}: {rightSide}
      </Text>
    </View>
  );
}

function renderSubject(subject) {
  return subject.toUpperCase();
}

function renderModifier(modifier) {
  return modifier ? ` (${modifier})` : '';
}

function renderContent(content) {
  if (!Array.isArray(content)) return content;

  return content.map(part => {
    return part.type === 'lettering-bold'
      ? <BoldText key={part.content}>{part.content}</BoldText>
      : <PlainText key={part.content}>{part.content}</PlainText>
  });
}

function BoldText({ children }) {
  return <Text style={boldStyle}>{children}</Text>;
}

function PlainText({ children }) {
  return <Text>{children}</Text>;
}
