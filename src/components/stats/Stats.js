import React, { Component } from 'react';
import Stat from '../stat/Stat'
import Histogram from '../histogram/Histogram'

// CSS Imports
import './Stats.css';


////////////////////////////////////////////////////////////////////////////////
// Stats Maths & Transforms
////////////////////////////////////////////////////////////////////////////////

const calculateAverageDialogueLength = a => {
  const dialogues = a.filter(a => a.type === 'dialogue');
  // Gets average, and rounds. Sums wordCounts, and devides by length.
  return Math.round(dialogues.reduce((a, c) => a + c.wordCount, 0) / dialogues.length);
}

const calculatePageCount = a => a.filter(a => a.type === 'page').length;

const transformHistographData = type => data => data.reduce((a, c) => {
  // we encounter an A
  if (c.type === "page" ) {
  // start a new sub array
    a.push([]);
  } else { // current is not A
  // make sure there is a sub array started
    if (a.length === 0) {
      a.push([]);
    }
    // add current to the latest sub array
    a[a.length - 1].push(c);
  }
  return a;
}, []).filter(a => a.length > 0);


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
        <Stat.HistoGraph title="ComicGraph™">
          <Histogram data={transformHistographData("")(this.props.stats)}/>
        </Stat.HistoGraph>
      </div>
    );
  }
}

// Default Props
////////////////////////////////////////////////////////////////////////////////
Stats.defaultProps = {};
