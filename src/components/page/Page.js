import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Page.css'

export default class Page extends Component {
  render() {
    return (
      <section className="c-page">
        <h2 className="c-page__title">
          <span className="u-font-size--marcus">Page {this.props.number}</span>
          <span className=" u-font-size--saya c-page__panel-count">
            <abbr title="Panel Count">{this.props.panelCount}</abbr>
          </span>
        </h2>
        {this.props.children}
      </section>
    );
  }
}

Page.propTypes = {
  number: PropTypes.number.isRequired,
  panelCount: PropTypes.number.isRequired
};
