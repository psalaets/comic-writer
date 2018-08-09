import React, { Component } from 'react';

export default class Sfx extends Component {
  render() {
    return (
      <div className="Dialogue">
        <div className="Dialogue__meta">
          {`${!isNaN(this.props.number) ? `${this.props.number}.` : ''}`} {this.props.speaker} {this.props.modifier ? `(${this.props.modifier})`:''}:
        </div>
        <div className="Dialogue__content">
          {this.props.children}
        </div>
      </div>
    );
  }
}
