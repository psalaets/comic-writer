import React, { Component } from 'react';

import { PanelCount, WordCount, EditorChangeEvent } from '../types';
import CodeMirror from './codemirror/CodeMirror';

type Props = {
  value: string,
  panelCounts: Array<PanelCount>,
  wordCounts: Array<WordCount>,
  characters: Array<string>,
  onChange: (event: EditorChangeEvent) => void
}

export default class Editor extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return (
      <CodeMirror
        editorWidth={80}
        value={this.props.value}
        panelCounts={this.props.panelCounts}
        wordCounts={this.props.wordCounts}
        characters={this.props.characters}
        onChange={this.handleChange}
      />
    )
  }

  handleChange(event: EditorChangeEvent): void {
    this.props.onChange(event);
  }
}
