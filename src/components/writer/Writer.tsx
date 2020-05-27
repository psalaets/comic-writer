import React from 'react';
import './Writer.css';

import { Editor } from '../../editor';

export default () => {
  return (
    <main className="c-writer">
      <h2 className="u-hide--visually">Editor</h2>
      <Editor />
    </main>
  );
}
