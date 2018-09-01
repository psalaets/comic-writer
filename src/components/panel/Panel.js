import React, { Component } from 'react';

export default class Panel extends Component {
  render() {
    return (
      <div>
        <h3 className="u-font-size--maria">Panel {this.props.number}</h3>
        {this.props.children}
      </div>
    );
  }
}
