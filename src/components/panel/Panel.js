import React, { Component } from 'react';

export default class Panel extends Component {
  render() {
    return <h3 className="u-font-size--maria">{this.props.children}</h3>;
  }
}
