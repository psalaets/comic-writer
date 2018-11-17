import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lettering from '../lettering/Lettering';

export default class Dialogue extends Component {
  constructor(props) {
    super(props);

    this.renderGutterContent = this.renderGutterContent.bind(this);
  }

  render() {
    return (
      <Lettering
        number={this.props.number}
        subject={this.props.speaker}
        modifier={this.props.modifier}
        content={this.props.content}
        renderGutterContent={this.renderGutterContent}
      />
    );
  }

  renderGutterContent() {
    return (
      <abbr title="Word Count">{this.props.wordCount}</abbr>
    );
  }
}

Dialogue.propTypes = {
  number: PropTypes.number.isRequired,
  speaker: PropTypes.string.isRequired,
  modifier: PropTypes.string,
  content: PropTypes.array.isRequired,
  wordCount: PropTypes.number.isRequired
};