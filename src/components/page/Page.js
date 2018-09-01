import React, { Component } from 'react';
import './Page.css'

export default class Page extends Component {
  render() {
    return (
      <section className="Page">
        <h2 className="
          Page__title
        ">
          <span className="
            u-font-size--marcus
          ">Page {this.props.number}</span>
          <span className="u-hide--visually">: </span>
          <span className="
            u-font-size--saya
            Page__panel-count
          ">{this.panelCount()}</span>
        </h2>
        {this.props.children}
      </section>
    );
  }

  panelCount() {
    if (this.props.panelCount === 0) {
      return '';
    }

    const label = this.props.panelCount === 1 ? 'Panel' : 'Panels';
    return `${this.props.panelCount} ${label}`;
  }
}
