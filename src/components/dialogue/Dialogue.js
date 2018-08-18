import React, { Component } from 'react';
import Lettering from '../lettering/Lettering';

export default class Dialogue extends Component {
  render() {
    return (
      <Lettering
        number={this.props.number}
        subject={this.props.speaker}
        modifier={this.props.modifier}
        content={this.props.children}
      />
    );
  }
}
