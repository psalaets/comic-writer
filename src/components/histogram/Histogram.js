import React, { Component } from 'react';
import PropTypes from 'prop-types';

// CSS Imports
import './Histogram.css';

// Third Party Imports

////////////////////////////////////////////////////////////////////////////////
// Histogram
////////////////////////////////////////////////////////////////////////////////

const clamp = (num, min, max) => num <= min ? min : num >= max ? max : num;

const HistogramUnit = props => (
  <div className={`c-histogram__type c-histogram__type--${props.type} c-histogram__type--intensity-${props.intensity}`}/>
)
const makeTypes = data => (
  <>
    <HistogramUnit
      intensity={clamp(data.filter(a => a.type === "panel").length, 0, 10)}
      type="panel"
    />
    <HistogramUnit
      intensity={clamp(data.filter(a => a.type === "dialogue").length, 0, 10)}
      type="dialogue"
    />
  </>
)

const HistogramPage = props => <div className="c-histogram__page">
  <div className="c-histogram__column-label u-font-size--saya">{props.index}</div>
  {makeTypes(props.page)}
</div>


const makePages = data => data.map((p, i) => <HistogramPage index={i + 1} page={p}/>);



export default class Histogram extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="c-histogram">
        <div className="c-histogram__row-label">
          <div className="u-font-size--saya">&nbsp;</div>
          <div className="u-font-size--saya">Panel</div>
          <div className="u-font-size--saya">Dialouge</div>
        </div>
        {makePages(this.props.data)}
      </div>
    );
  }
}

// Default Props
////////////////////////////////////////////////////////////////////////////////
Histogram.defaultProps = {};

// Type Checking
////////////////////////////////////////////////////////////////////////////////
Histogram.PropTypes = {};
