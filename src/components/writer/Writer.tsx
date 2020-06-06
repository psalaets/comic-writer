import React from 'react';
import './Writer.css';

import { Editor, Outline } from '../../editor';

export default () => {
  return (
    <main className="c-writer">
      <h2 className="u-hide--visually">Editor</h2>
      <Outline />
      <Editor />
    </main>
  );
}
