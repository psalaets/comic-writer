import React from "react";
// import PropTypes from 'prop-types';


// CSS Imports
import "./Histogram.css";

////////////////////////////////////////////////////////////////////////////////
// Histogram
////////////////////////////////////////////////////////////////////////////////
const Container = props =>
  <div className="c-histogram">
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
      {props.pageIndex}
    </div>
    {props.children}
  </div>
);

const Unit = props => (
  <div
    className={`c-histogram__unit c-histogram__unit--${props.type} c-histogram__unit--intensity-${clamp(props.intensity, 0, 10)}`}
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
  Unit: Unit
}

export default Histogram;
