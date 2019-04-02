import React, { Component } from 'react';
import Stat from '../stat/Stat'
import Histogram from '../histogram/Histogram'

// CSS Imports
import './Stats.css';


////////////////////////////////////////////////////////////////////////////////
// Stats Maths
////////////////////////////////////////////////////////////////////////////////
const calculateAverageDialogueLength = a => {
  const dialogues = a.filter(a => a.type === 'dialogue');
  // Gets average, and rounds. Sums wordCounts, and devides by length.
  return Math.round(dialogues.reduce((a, c) => a + c.wordCount, 0) / dialogues.length);
}

const calculatePageCount = a => a.filter(a => a.type === 'page').length;

////////////////////////////////////////////////////////////////////////////////
// Stats
////////////////////////////////////////////////////////////////////////////////

export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      histogramType: ''
    };
  }

  render() {
    return (
      <div className="c-stats">
        <Stat.Text title="Page Count">
          {calculatePageCount(this.props.stats)}
        </Stat.Text>
        <Stat.Text title="Average Dialouge Length">
          {calculateAverageDialogueLength(this.props.stats)}
        </Stat.Text>
        <Stat.HistoGraph title="Average Dialouge Length">
          <Histogram filter={this.state.histogramType}/>
        </Stat.HistoGraph>
      </div>
    );
  }
}

// Default Props
////////////////////////////////////////////////////////////////////////////////
Stats.defaultProps = {};
