import React from "react";
// import PropTypes from 'prop-types';
import ToolipPopover from "../tooltip-popover/TooltipPopover";

// CSS Imports
import "./Histogram.css";

// Third Party Imports
import { Tooltip } from "react-accessible-tooltip";
import { clamp } from "./histogram-math";

////////////////////////////////////////////////////////////////////////////////
// Histogram
////////////////////////////////////////////////////////////////////////////////

const HistogramUnit = props => (
  <div
    role="gridcell"
    className={`c-histogram__unit c-histogram__unit--${
      props.type
    } c-histogram__unit--intensity-${props.intensity}`}
  >
    <div className="c-histogram__unit-desc u-hide--visually">
      {props.intensity}
    </div>
  </div>
);
const makeTypes = data => (
  <>
    <Tooltip
      className="c-histogram__unit-container

      "
      label={props => (
        <HistogramUnit
          {...props.labelAttributes}
          intensity={clamp(data.filter(a => a.type === "panel").length, 0, 10)}
          type="panel"
        />
      )}
      overlay={props => (
        <ToolipPopover
          {...props.overlayAttributes}
          hidden={props.isHidden}
          noWrap={true}
        >
          {data.filter(a => a.type === "panel").length} Panels
        </ToolipPopover>
      )}
    />

    <Tooltip
      className="c-histogram__unit-container"
      label={props => (
        <HistogramUnit
          {...props.labelAttributes}
          intensity={clamp(
            data.filter(a => a.type === "dialogue").length, 0, 10
          )}
          type="dialogue"
        />
      )}
      overlay={props => (
        <ToolipPopover
          {...props.overlayAttributes}
          hidden={props.isHidden}
          noWrap={true}
        >
          {data.filter(a => a.type === "dialogue").length} Dialogues
        </ToolipPopover>
      )}
    />

    <Tooltip
      className="c-histogram__unit-container"
      label={props => (
        <HistogramUnit
          {...props.labelAttributes}
          intensity={clamp(
            Math.round(
              (data.filter(a => a.type !== "page").reduce((a, c) => a + c.wordCount, 0) / 2) * 0.1
            ), 0, 10)}
          type="word-count"
        />
      )}
      overlay={props => (
        <ToolipPopover
          {...props.overlayAttributes}
          hidden={props.isHidden}
          noWrap={true}
        >
          {data
            .filter(a => a.type !== "page")
            .reduce((a, c) => a + c.wordCount, 0) / 2} Words
        </ToolipPopover>
      )}
    />
  </>
);

const HistogramPage = props => (
  <div className="c-histogram__page">
    <div className="c-histogram__column-label u-font-size--saya">
      {props.index}
    </div>
    {makeTypes(props.page)}
  </div>
);

const makePages = data =>
  data.map((p, i) => <HistogramPage index={i + 1} page={p} />);

const HistogramLabels = props => (
  <section className="c-histogram__row-label">
    <div aria-hidden="true" className="u-font-size--saya">
      &nbsp;
    </div>
    <h4 className="u-font-size--saya">Panel</h4>
    <h4 className="u-font-size--saya">Dialouge</h4>
    <h4 className="u-font-size--saya">Words</h4>
  </section>
);

export default function Histogram(props) {
  return <div role="grid" className="c-histogram">
    <HistogramLabels/>
    {makePages(props.data)}
  </div>
}
// Default Props
////////////////////////////////////////////////////////////////////////////////
Histogram.defaultProps = {
  data: []
};
