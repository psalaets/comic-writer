import React, { Component } from 'react';
import './LetteringBold.css';

export default class LetteringBold extends Component {
  render() {
    return <span class="LetteringBold">{this.props.children}</span>;
  }
}
