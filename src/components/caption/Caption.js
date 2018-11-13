import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lettering from '../lettering/Lettering';

export default class Caption extends Component {
  render() {
    return (
      <Lettering
        number={this.props.number}
        subject="CAPTION"
        modifier={this.props.modifier}
        content={this.props.content}
      />
    );
  }
}

Caption.propTypes = {
  number: PropTypes.number.isRequired,
  modifier: PropTypes.string
};