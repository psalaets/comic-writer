import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Panel.css';

import { renderNodes } from '../render-script-content';

export default class Panel extends Component {
  render() {
    const wordCount = this.props.dialogueWordCount + this.props.captionWordCount;

    return (
      <section className="c-panel">
        <h3 className="c-panel__title">
          <span className="u-font-size--maria"> Panel {this.props.number}</span>
        </h3>
        {renderNodes(this.props.content)}
        <aside className="u-font-size--saya c-panel__gutter">
          <abbr title="Word Count">{wordCount}</abbr>
        </aside>
      </section>
    );
  }
}

Panel.propTypes = {
  number: PropTypes.number.isRequired,
  content: PropTypes.array.isRequired,
  dialogueWordCount: PropTypes.number.isRequired,
  captionWordCount: PropTypes.number.isRequired
};
