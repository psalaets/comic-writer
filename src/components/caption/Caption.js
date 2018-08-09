import React, { Component } from 'react';

export default class Caption extends Component {
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