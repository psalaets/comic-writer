import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import ToolipPopover from '../tooltip-popover/TooltipPopover'

// CSS Imports
import './Histogram.css';

// Third Party Imports
import { Tooltip } from "react-accessible-tooltip";

////////////////////////////////////////////////////////////////////////////////
// Histogram
////////////////////////////////////////////////////////////////////////////////

const clamp = (num, min, max) => num <= min ? min : num >= max ? max : num;

const HistogramUnit = props => (
  <div className={`c-histogram__unit c-histogram__unit--${props.type} c-histogram__unit--intensity-${props.intensity}`}></div>
)
const makeTypes = data => (
  <>
    <Tooltip
      className="c-histogram__unit-container"
      label={
        props => <HistogramUnit {...props.labelAttributes}intensity={clamp(data.filter(a => a.type === "panel").length, 0, 10)} type="panel" />
      }
      overlay={
        props => (
          <ToolipPopover {...props.overlayAttributes}
            hidden={props.isHidden}
            noWrap={true}>
            {data.filter(a => a.type === "panel").length} Panels
          </ToolipPopover>
        )
      }/>

    <Tooltip
      className="c-histogram__unit-container"
      label={
        props => <HistogramUnit {...props.labelAttributes} intensity={clamp(data.filter(a => a.type === "dialogue").length, 0, 10)} type="dialogue" />
      }
      overlay={
        props => (
          <ToolipPopover {...props.overlayAttributes}
            hidden={props.isHidden}
            noWrap={true}>
            {data.filter(a => a.type === "dialogue").length} Dialogues
          </ToolipPopover>
        )
      }/>

    <Tooltip
      className="c-histogram__unit-container"
      label={
        props => <HistogramUnit {...props.labelAttributes} intensity={clamp(Math.round((data.filter(a => a.type !== "page").reduce((a, c) => a + c.wordCount, 0) / 2) * .1), 0, 10)} type="word-count" />
      }
      overlay={
        props => (
          <ToolipPopover {...props.overlayAttributes}
            hidden={props.isHidden}
            noWrap={true}>
            {data.filter(a => a.type !== "page").reduce((a, c) => a + c.wordCount, 0) / 2} Words
          </ToolipPopover>
        )
      }/>

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
          <div className="u-font-size--saya">Words</div>
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
// Histogram.PropTypes = {};
