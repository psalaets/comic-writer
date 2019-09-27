import React from 'react';
import Lettering from './Lettering';

export default function Caption({ number, modifier, content }) {
  return (
    <Lettering
      number={number}
      subject="CAPTION"
      modifier={modifier}
      content={content}
    />
  );
}
