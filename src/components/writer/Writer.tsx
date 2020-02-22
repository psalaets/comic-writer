import React from 'react';
import './Writer.css';

import { ConnectedEditor } from '../../editor';

export default () => {
  return (
    <main className="c-writer">
      <h2 className="u-hide--visually">Editor</h2>
      <ConnectedEditor />
    </main>
  );
}
