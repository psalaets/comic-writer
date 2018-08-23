import React, { Component } from 'react';
import './Script.css';

import { reactOutput } from '../../custom-markdown';

export default class Script extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  componentDidUpdate(previousProps) {
    if (this.props.scrollPercentage !== previousProps.scrollPercentage) {
      this.scrollRef.current.scrollTop = this.props.scrollPercentage * (this.scrollRef.current.scrollHeight - this.scrollRef.current.clientHeight)
    }
  }

  render() {
    const output = reactOutput(this.props.blocks);
    return (
      <div
        className="Script"
        onScroll={this.props.handelScroll}
        ref={this.scrollRef}
      >
        {output}
      </div>
    );
  }
}
