import React, { Component } from 'react';
import Lettering from '../lettering/Lettering';

export default class Caption extends Component {
  render() {
    return (
      <Lettering
        number={this.props.number}
        subject="CAPTION"
        modifier={this.props.modifier}
        content={this.props.children}
      />
    );
  }
}
