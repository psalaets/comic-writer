import React, { Component } from 'react';
import './Page.css'

export default class Page extends Component {
  render() {
    return (
      <h2 className="
        Page
      ">
        <div className="
          u-font-size--marcus
        ">{this.props.children}</div>
        <span className="
          u-font-size--saya
          Page__count
        ">{this.panelCount()}</span>
      </h2>
    );
  }

  panelCount() {
    if (this.props.panelCount === 0) {
      return '';
    }

    const label = this.props.panelCount === 1 ? 'panel' : 'panels';
    return `${this.props.panelCount} ${label}`;
  }
}
