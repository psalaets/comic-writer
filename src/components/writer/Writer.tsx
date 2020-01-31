import React, { Component } from 'react';
import './Writer.css';

import Editor, { EditorChangeEvent } from '../editor/Editor';
import { ComicStats } from '../../stats/types';

export interface SourceChangeEvent {
  source: string;
}

type WriterProps = {
  source: string;
  onSourceChange: (event: SourceChangeEvent) => void;
  stats: Array<ComicStats>;
  characters: Array<string>;
};

export default class Writer extends Component<WriterProps, {}> {
  constructor(props: WriterProps) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: EditorChangeEvent) {
    this.props.onSourceChange({
      source: event.value
    });
  }

  render() {
    return (
      <main className="c-writer">
        <h2 className="u-hide--visually">Editor</h2>
        <Editor
          key="editor"
          value={this.props.source}
          stats={this.props.stats}
          characters={this.props.characters}
          onChange={this.handleChange}
        />
      </main>
    );
  }
}
