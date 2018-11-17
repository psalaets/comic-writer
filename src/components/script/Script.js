import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Script.css';

import { renderNodes } from '../render-script-content';

export default class Script extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  componentDidUpdate(previousProps) {
    if (this.props.scrollPercentage !== previousProps.scrollPercentage) {
      this.scrollRef.current.scrollTop = this.props.scrollPercentage * (this.scrollRef.current.scrollHeight - this.scrollRef.current.clientHeight) / 100;
    }
  }

  render() {
    return (
      <article
        tabIndex={this.props.tabIndexHide ? '-1' : 0}
        className="c-script"
        ref={this.scrollRef}
      >
        <div className="c-script__content">
          {renderNodes(this.props.blocks)}
        </div>
        <div className="c-script__scrollpast"></div>
      </article>
    );
  }
}

Script.propTypes = {
  scrollPercentage: PropTypes.number.isRequired,
  blocks: PropTypes.array.isRequired
};
