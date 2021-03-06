import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Lettering.css';

import { LETTERING_BOLD } from '../../parser/types';
import LetteringBold from '../lettering-bold/LetteringBold';

export default class Lettering extends Component {
  render() {
    const modifier = this.props.modifier ? ` (${this.props.modifier})` : '';
    const meta = `${this.props.number}. ${this.props.subject}${modifier}`;

    return (
      <section className="c-lettering">
        <h4 className="c-lettering__meta">
          <span className="">{meta}</span>
        </h4>
        <blockquote className="c-lettering__content">
          {renderContent(this.props.content)}
        </blockquote>
        {this.renderGutter()}
      </section>
    );
  }

  renderGutter() {
    if (this.props.renderGutterContent) {
      return (
        <aside className="u-font-size--saya c-lettering__gutter">
          {this.props.renderGutterContent()}
        </aside>
      );
    } else {
      return null;
    }
  }
}

function renderContent(content) {
  if (!Array.isArray(content)) return content;

  return content
    .map((part, index) => {
      return part.type === LETTERING_BOLD
        ? <LetteringBold key={index}>{part.content}</LetteringBold>
        : part.content;
    });
}

Lettering.propTypes = {
  number: PropTypes.number.isRequired,
  subject: PropTypes.string.isRequired,
  modifier: PropTypes.string,
  content: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.array.isRequired
  ]),
  renderGutterContent: PropTypes.func
};
