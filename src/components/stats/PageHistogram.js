import React from 'react';
import Stat from '../stat/Stat'

import Histogram from '../histogram/Histogram';
import ToolipPopover from '../tooltip-popover/TooltipPopover';

// Thirt Party Imports
import { Tooltip } from "react-accessible-tooltip";

// These are the individual metrics for the graph. They define the "rows"'s
// Intensity is clamped to a number between 1 - 10
const pageMetrics = (pageData) => [
  {
    label: 'Panels',
    type: 'panel',
    intensity: pageData.filter(a => a.type === "panel").length,
    popoverContent: `${pageData.filter(a => a.type === "panel").length} Panels`
  },
  {
    label: 'Words',
    type: 'word-count',
    intensity: Math.round((pageData.filter(a => a.type !== "page").reduce((a, c) => a + c.wordCount, 0) / 2) * 0.1),
    popoverContent: `${pageData.filter(a => a.type !== "page").reduce((a, c) => a + c.wordCount, 0) / 2} Words`
  },
  {
    label: 'Balloons',
    type: 'dialogue',
    intensity: pageData.filter(a => a.type === "dialogue").length,
    popoverContent: `${pageData.filter(a => a.type === "dialogue").length} Dialogues`
  },
]

const transformHistographData = data => data.reduce((a, c) => {
    // we encounter a dataset with the type "page"
    if (c.type === "page" ) {
    // start a new sub array
      a.push([]);
    } else {
    // make sure there is a sub array started
      if (a.length === 0) {
        a.push([]);
      }
      // add current to the latest sub array
      a[a.length - 1].push(c);
    }
    return a;
  }, [])
  // Remove empty Arrays []
  .filter(a => a.length >= 0);

const makePageMetric = ({type, intensity, popoverContent}, i) =>
  // https://github.com/ryami333/react-accessible-tooltip
  // Tooltip Documentation
  <Tooltip
    key={i}
    tabIndex="0"
    className="c-histogram__unit-container"
    label={props => (
      <Histogram.Unit
        key={i}
        {...props.labelAttributes}
        intensity={intensity}
        type={type}
      />
    )}
    overlay={props => (
      <ToolipPopover
        key={i}
        {...props.overlayAttributes}
        hidden={props.isHidden}
        noWrap={true}
      >
        {popoverContent}
      </ToolipPopover>
    )}
  />

const PageHistogram = props =>
  <Stat.HistoGraph title="By Page">
    <Histogram.Container>
      {transformHistographData(props.stats).some(a => a) ?
        transformHistographData(props.stats).map((p, i) =>
          <React.Fragment key={i}>
          {i === 0 ?
            <Histogram.Labels key={`label-${i}`}>
              {pageMetrics(p).map((a, i) => <h4 key={i} className="u-font-size--saya">{a.label}</h4>)}
            </Histogram.Labels>: false}
          <Histogram.Page key={i} pageIndex={i + 1}>
            {pageMetrics(p).map(makePageMetric)}
          </Histogram.Page>
          </React.Fragment>
        ) :
        <span>No Data, yet! Get writing!</span>}
    </Histogram.Container>
  </Stat.HistoGraph>


export default PageHistogram;
