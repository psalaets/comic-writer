import React from "react";
// import PropTypes from 'prop-types';


// CSS Imports
import "./Histogram.css";

////////////////////////////////////////////////////////////////////////////////
// Histogram
////////////////////////////////////////////////////////////////////////////////
const Container = props =>
  <div role="grid" className="c-histogram">
    {props.children}
  </div>

const Labels = props => (
  <section className="c-histogram__row-label">
    <div aria-hidden="true" className="u-font-size--saya">
      &nbsp;
    </div>
    {props.children}
  </section>
);

const Page = props => (
  <div className="c-histogram__page">
    <div className="c-histogram__column-label u-font-size--saya">
      {props.index}
    </div>
    {props.children}
  </div>
);

const Unit = props => (
  <div
    role="gridcell"
    className={`c-histogram__unit c-histogram__unit--${props.type} c-histogram__unit--intensity-${props.intensity}`}
  >
    <div className="c-histogram__unit-desc u-hide--visually">
      {props.intensity}
    </div>
  </div>
);

const clamp = (num, min, max) => num <= min ? min : num >= max ? max : num;

const Histogram = {
  Container: Container,
  Labels: Labels,
  Page: Page,
  Unit: Unit,
  clamp: clamp
}

export default Histogram;
