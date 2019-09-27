import React from 'react';
import Lettering from './Lettering';

export default function Sfx({ number, modifier, content }) {
  return (
    <Lettering
      number={number}
      subject="SFX"
      modifier={modifier}
      content={content}
    />
  );
}
