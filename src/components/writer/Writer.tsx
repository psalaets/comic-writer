import React, { Component } from 'react';
import './Writer.css';

import { Editor } from '../../editor';
import { EditorChangeEvent, PanelCount, WordCount } from '../../editor/types';

export interface SourceChangeEvent {
  source: string;
}

interface WriterProps {
  source: string;
  onSourceChange: (event: SourceChangeEvent) => void;
  panelCounts: Array<PanelCount>;
  wordCounts: Array<WordCount>;
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
          panelCounts={this.props.panelCounts}
          wordCounts={this.props.wordCounts}
          characters={this.props.characters}
          onChange={this.handleChange}
        />
      </main>
    );
  }
}
