import React, { Component } from 'react';
import './Script.css';

import { reactOutput } from '../../custom-markdown';

export default class Script extends Component {
  constructor(props) {
    super(props);

    this.setBottomElement = this.setBottomElement.bind(this);
  }

  componentDidUpdate(previousProps) {
    const charsAdded = this.props.sourceLength > previousProps.sourceLength;

    if (charsAdded && this.props.cursorAtEnd) {
      if (this.bottomElement) {
        this.bottomElement.scrollIntoView();
      }
    }
  }

  render() {
    const output = reactOutput(this.props.blocks);
    return (
      <div className="Script">
        {output}
        <div ref={this.setBottomElement} />
      </div>
    );
  }

  setBottomElement(element) {
    this.bottomElement = element;
  }
}
