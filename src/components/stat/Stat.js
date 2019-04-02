import React from 'react';
import './Stat.css';

const Text = props => (
  <div className="c-stat c-stat--text">
    <h2 className="u-font-size--saya">{props.title}</h2>
    <span className="c-stat__content u-font-size--marcus">{props.children}</span>
  </div>
)

const HistoGraph = props => (
  <div className="c-stat c-stat--histo">
    <h2 className="u-font-size--saya">{props.title}</h2>
    <div className="c-stat__content">{props.children}</div>
  </div>
)

const Stat = {
  Text: Text,
  HistoGraph: HistoGraph
}

export default Stat;
