import React, { Component } from 'react';
import './LetteringBold.css';

export default class LetteringBold extends Component {
  render() {
    return <strong className="LetteringBold">{this.props.children}</strong>;
  }
}