import React, { Component } from 'react';

export default class Dialogue extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>number: {this.props.number}</li>
          <li>speaker: {this.props.speaker}</li>
          <li>modifier: {this.props.modifier}</li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}