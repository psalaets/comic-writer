import React, { Component } from 'react';

export default class Page extends Component {
  render() {
    return <h2>{this.props.children}{this.panelCount()}</h2>;
  }

  panelCount() {
    if (this.props.panelCount === 0) {
      return '';
    }

    const label = this.props.panelCount === 1 ? 'panel' : 'panels';
    return ` (${this.props.panelCount} ${label})`;
  }
}