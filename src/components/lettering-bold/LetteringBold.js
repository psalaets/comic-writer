import React, { Component } from 'react';
import './LetteringBold.css';

export default class LetteringBold extends Component {
  render() {
    return <strong className="c-lettering-bold">{this.props.children}</strong>;
  }
}
