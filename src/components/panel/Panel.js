import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Panel.css';

import { renderNodes } from '../render-script-content';

export default class Panel extends Component {
  render() {
    return (
      <section className="c-panel">
        <h3 className="c-panel__title">
          <span className="u-font-size--maria"> Panel {this.props.number}</span>
          <span className=" u-font-size--saya c-panel__dialouge-count">
            <abbr title="Lettering Count">99</abbr>
          </span>
        </h3>
        {renderNodes(this.props.content)}
      </section>
    );
  }
}

Panel.propTypes = {
  number: PropTypes.number.isRequired,
  content: PropTypes.array.isRequired
};
