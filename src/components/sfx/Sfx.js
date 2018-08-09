import React, { Component } from 'react';

export default class Sfx extends Component {
  render() {
    return (
      <div>
        <ul>
          <li>number: {this.props.number}</li>
          <li>modifier: {this.props.modifier}</li>
        </ul>
        {this.props.children}
      </div>
    );
  }
}