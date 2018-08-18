import React, { Component } from 'react';
import './Lettering.css';

export default class Lettering extends Component {
  render() {
    const modifier = this.props.modifier ? ` (${this.props.modifier})` : '';
    const meta = `${this.props.number}. ${this.props.subject}${modifier}`;

    return (
      <div className="Lettering">
        <div className="Lettering__meta">
          {meta}
        </div>
        <div className="Lettering__content">
          {this.props.content}
        </div>
      </div>
    );
  }
}