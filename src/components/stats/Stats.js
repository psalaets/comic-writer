import React, { Component } from 'react';
import Stat from '../stat/Stat'
import Histogram from '../histogram/Histogram'
import ToolipPopover from "../tooltip-popover/TooltipPopover";

// CSS Imports
import './Stats.css';

// Thirt Party Imports
import { Tooltip } from "react-accessible-tooltip";

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
    this.state = {};
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

          <Histogram.Container>
            <Histogram.Labels>
              <h4 className="u-font-size--saya">Panel</h4>
              <h4 className="u-font-size--saya">Dialouge</h4>
              <h4 className="u-font-size--saya">Words</h4>
            </Histogram.Labels>

            {transformHistographData("")(this.props.stats)
              .map((p, i) =>
                <Histogram.Page index={i + 1} page={p}>

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
      </div>
    );
  }
}

// Default Props
////////////////////////////////////////////////////////////////////////////////
Stats.defaultProps = {};
