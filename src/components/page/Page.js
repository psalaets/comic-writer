import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Page.css'

import { renderNodes } from '../render-script-content';

export default class Page extends Component {
  render() {
    const wordCount = this.props.dialogueWordCount + this.props.captionWordCount;

    return (
      <section className="c-page">
        <h2 className="c-page__title">
          <span className="u-font-size--marcus">Page {this.props.number}</span>
        </h2>
        {renderNodes(this.props.content)}
        <aside className="u-font-size--saya c-page__gutter">
          <abbr title="Word Count">{wordCount}</abbr>
        </aside>
      </section>
    );
  }
}

Page.propTypes = {
  number: PropTypes.number.isRequired,
  panelCount: PropTypes.number.isRequired,
  content: PropTypes.array.isRequired,
  dialogueWordCount: PropTypes.number.isRequired,
  captionWordCount: PropTypes.number.isRequired
};
