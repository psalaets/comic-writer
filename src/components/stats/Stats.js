import React, { Component } from 'react';

// CSS Imports
import './Stats.css';

// Thirt Party Imports

////////////////////////////////////////////////////////////////////////////////
// Stats
////////////////////////////////////////////////////////////////////////////////

export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="c-stats">
        {this.props.children}
      </div>
    );
  }
}

// Default Props
////////////////////////////////////////////////////////////////////////////////
Stats.defaultProps = {};
