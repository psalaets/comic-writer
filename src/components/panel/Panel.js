import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Panel.css';

export default class Panel extends Component {
  render() {
    return (
      <section className="c-panel">
        <h3 className="c-panel__title">
          <span className="u-font-size--maria"> Panel {this.props.number}</span>
          <span className=" u-font-size--saya c-panel__dialouge-count">
            <span className="u-hide--visually">Dialoug Count: </span>
            99
          </span>
        </h3>
        {this.props.children}
      </section>
    );
  }
}

Panel.propTypes = {
  number: PropTypes.number.isRequired
};
