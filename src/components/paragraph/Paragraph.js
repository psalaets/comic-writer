import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Paragraph extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="paragraph">{this.props.content}</div>;
  }
}

Paragraph.propTypes = {
  content: PropTypes.string.isRequired
};