import React, { Component } from 'react';

export default class Panel extends Component {
  render() {
    return <h3>{this.props.children}</h3>;
  }
}