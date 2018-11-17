import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Lettering from '../lettering/Lettering';

export default class Caption extends Component {
  constructor(props) {
    super(props);

    this.renderGutterContent = this.renderGutterContent.bind(this);
  }

  render() {
    return (
      <Lettering
        number={this.props.number}
        subject="CAPTION"
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

Caption.propTypes = {
  number: PropTypes.number.isRequired,
  modifier: PropTypes.string,
  wordCount: PropTypes.number.isRequired
};