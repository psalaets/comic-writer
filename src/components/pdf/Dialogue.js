import React from 'react';
import Lettering from './Lettering';

export default function Dialogue({ number, speaker, modifier, content }) {
  return (
    <Lettering
      number={number}
      subject={speaker}
      modifier={modifier}
      content={content}
    />
  );
}
