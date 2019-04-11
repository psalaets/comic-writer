import React from 'react';
import Stat from '../stat/Stat'

import Histogram from '../histogram/Histogram';
import ToolipPopover from '../tooltip-popover/TooltipPopover';

// Thirt Party Imports
import { Tooltip } from "react-accessible-tooltip";

const transformHistographData = data => data.reduce((a, c) => {
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

const PageHistogram = props =>
  <Stat.HistoGraph title="ComicGraph™">
    <Histogram.Container>
      <Histogram.Labels>
        <h4 className="u-font-size--saya">Panel</h4>
        <h4 className="u-font-size--saya">Dialouge</h4>
        <h4 className="u-font-size--saya">Words</h4>
      </Histogram.Labels>
      {transformHistographData(props.stats).map((p, i) =>
      <Histogram.Page key={i} pageIndex={i + 1}>
        <Tooltip
          className="c-histogram__unit-container"
          label={props => (
            <Histogram.Unit
              {...props.labelAttributes}
              intensity={Histogram.clamp(p.filter(a => a.type === "panel").length, 0, 10)}
              type="panel"
            />
          )}
          overlay={props => (
            <ToolipPopover
              {...props.overlayAttributes}
              hidden={props.isHidden}
              noWrap={true}
            >
              {p.filter(a => a.type === "panel").length} Panels
            </ToolipPopover>
          )}
        />
        <Tooltip
          className="c-histogram__unit-container"
          label={props => (
            <Histogram.Unit
              {...props.labelAttributes}
              intensity={Histogram.clamp(
                p.filter(a => a.type === "dialogue").length, 0, 10
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
              {p.filter(a => a.type === "dialogue").length} Dialogues
            </ToolipPopover>
          )}
        />
        <Tooltip
          className="c-histogram__unit-container"
          label={props => (
            <Histogram.Unit
              {...props.labelAttributes}
              intensity={Histogram.clamp(
                  Math.round((p.filter(a => a.type !== "page").reduce((a, c) => a + c.wordCount, 0) / 2) * 0.1
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
              {p.filter(a => a.type !== "page")
                .reduce((a, c) => a + c.wordCount, 0) / 2} Words
            </ToolipPopover>
          )}
        />
      </Histogram.Page>)}
    </Histogram.Container>
  </Stat.HistoGraph>

export default PageHistogram;
