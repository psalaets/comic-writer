import React, { Component } from 'react';

export default class Page extends Component {
  render() {
    // TODO render panel count somehow
    return <h2>{this.props.children}</h2>;
  }
}