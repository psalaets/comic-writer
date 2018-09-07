import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Panel.css';

export default class Panel extends Component {
  render() {
    return (
      <section className="Panel">
        <h3 className="Panel__title u-font-size--maria">Panel {this.props.number}</h3>
        {this.props.children}
      </section>
    );
  }
}

Panel.propTypes = {
  number: PropTypes.number.isRequired
};