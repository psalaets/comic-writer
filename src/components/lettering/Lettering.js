import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Lettering.css';

export default class Lettering extends Component {
  render() {
    const modifier = this.props.modifier ? ` (${this.props.modifier})` : '';
    const meta = `${this.props.number}. ${this.props.subject}${modifier}`;

    return (
      <section className="Lettering">
        <h4 className="Lettering__meta">
          {meta}
        </h4>
        <blockquote className="Lettering__content">
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
  content: PropTypes.string.isRequired
};