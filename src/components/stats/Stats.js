import React, { Component } from 'react';

// CSS Imports
import './Stats.css';

// Third Party Imports
import {
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Tooltip
 } from 'recharts';

////////////////////////////////////////////////////////////////////////////////
// Stats
////////////////////////////////////////////////////////////////////////////////
export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterType: 'panel'
    };
  }

  render() {
    return (
      <>
        <h2 className="u-font-size--saya">Words per Panel</h2>
        <ResponsiveContainer>
          <ComposedChart data={this.props.stats}>
            <Tooltip isAnimationActive={false}/>
            <Bar barSize={15} dataKey="wordCount" fill="var(--color-utility-dove)"/>
          </ComposedChart>
        </ResponsiveContainer>
      </>
    );
  }
}

// Default Props
////////////////////////////////////////////////////////////////////////////////
Stats.defaultProps = {};
