import React from 'react';
import './Stat.css';

const Text = props => (
  <section className="c-stat c-stat--text">
    <h3 className="u-font-size--saya">{props.title}</h3>
    <span className="c-stat__content u-font-size--marcus">{props.children}</span>
  </section>
)

const HistoGraph = props => (
  <section className="c-stat c-stat--histo">
    <h3 className="u-font-size--saya">{props.title}</h3>
    <div className="c-stat__content">
      {props.children}
    </div>
  </section>
)

const Stat = {
  Text: Text,
  HistoGraph: HistoGraph
}

export default Stat;
