import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Script.css';

import { reactOutput } from '../../custom-markdown';

export default class Script extends Component {
  constructor(props) {
    super(props);
    this.scrollRef = React.createRef();
  }

  componentDidUpdate(previousProps) {
    if (this.props.scrollPercentage !== previousProps.scrollPercentage) {
      this.scrollRef.current.scrollTop = this.props.scrollPercentage * (this.scrollRef.current.scrollHeight - this.scrollRef.current.clientHeight)
    }
  }

  render() {
    const styles = {
      // flexBasis: `calc(${100 / this.props.editorWidthPercent}%)`
    }
    const output = reactOutput(this.props.blocks);
    return (
      <article
        tabIndex={this.props.tabIndexHide ? '-1' : 0}
        style={styles}
        className="c-script"
        ref={this.scrollRef}
      >
        <div className="c-script__content">
          {output}
        </div>
        <div className="c-script__scrollpast"></div>
      </article>
    );
  }
}

Script.propTypes = {
  scrollPercentage: PropTypes.number.isRequired
};
