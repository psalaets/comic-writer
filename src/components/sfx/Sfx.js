import React, { Component } from 'react';
import PropTypes from 'prop-types';
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

Sfx.propTypes = {
  number: PropTypes.number.isRequired,
  modifier: PropTypes.string
};