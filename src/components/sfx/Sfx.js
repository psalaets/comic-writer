import React, { Component } from 'react';
import Lettering from '../lettering/Lettering';

export default class Sfx extends Component {
  render() {
    return (
      <Lettering
        number={this.props.number}
        subject="SFX"
        modifier={this.props.modifier}
        content={this.props.children}
      />
    );
  }
}
