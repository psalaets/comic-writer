import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Lettering.css';

export default class Lettering extends Component {
  render() {
    const modifier = this.props.modifier ? ` (${this.props.modifier})` : '';
    const meta = `${this.props.number}. ${this.props.subject}${modifier}`;

    return (
      <section className="c-lettering">
        <h4 className="c-lettering__meta">
          {meta}
        </h4>
        <blockquote className="c-lettering__content">
          {this.props.content}
        </blockquote>
      </section>
    );
  }
}

Lettering.propTypes = {
  number: PropTypes.number.isRequired,
  subject: PropTypes.string.isRequired,
  modifier: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.array.isRequired
  ])
};
