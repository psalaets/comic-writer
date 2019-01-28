import React, { Component } from 'react';

// CSS Imports
import './Stats.css';

// Third Party Imports
import {BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

////////////////////////////////////////////////////////////////////////////////
// Stats
////////////////////////////////////////////////////////////////////////////////
export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterType: 'dialogue'
    };
  }

  render() {
    return (
      <div className="c-stats">
        {/* Make width of c-stats pass it's width to chart */}
        <BarChart width={400} height={100} data={this.props.stats
          .filter(o => o.type === this.state.filterType)}>
          <XAxis dataKey="lineNumber"/>
          <YAxis/>
          <CartesianGrid/>
          <Bar dataKey="wordCount" fill="var(--color-utility-dove)"/>
        </BarChart>
      </div>
    );
  }
}

// Default Props
////////////////////////////////////////////////////////////////////////////////
Stats.defaultProps = {};
