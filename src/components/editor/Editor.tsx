import React, { Component } from 'react';
import { ComicStats } from '../../stats/types';
import CodeMirror from './CodeMirror';

type Props = {
  value: string;
  stats: Array<ComicStats>;
  characters: Array<string>;
  onChange: (event: EditorChangeEvent) => void;
}

export interface EditorChangeEvent {
  value: string;
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
        stats={this.props.stats}
        characters={this.props.characters}
        onChange={this.handleChange}
      />
    )
  }

  handleChange(event: EditorChangeEvent): void {
    this.props.onChange(event);
  }
}
