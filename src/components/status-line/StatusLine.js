import React from 'react';
import './StatusLine.css';

const Container = (props) => (
  <div className="c-status-line u-font-size--saya">
    {props.children}
  </div>
);
const Spacer = (props) => (
  <div className="c-status-line__spacer"/>
);

const StatusLine = {
  Container: Container,
  Spacer: Spacer
}

export default StatusLine;
