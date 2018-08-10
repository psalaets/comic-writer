import React, { Component } from 'react';
import './LetteringBold.css';

export default class LetteringBold extends Component {
  render() {
    return <span className="LetteringBold">{this.props.children}</span>;
  }
}
