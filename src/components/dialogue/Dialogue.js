import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lettering from '../lettering/Lettering';

export default class Dialogue extends Component {
  render() {
    return (
      <Lettering
        number={this.props.number}
        subject={this.props.speaker}
        modifier={this.props.modifier}
        content={this.props.content}
      />
    );
  }
}

Dialogue.propTypes = {
  number: PropTypes.number.isRequired,
  speaker: PropTypes.string.isRequired,
  modifier: PropTypes.string,
  content: PropTypes.array.isRequired
};