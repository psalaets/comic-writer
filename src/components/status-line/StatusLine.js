import React from 'react';
import './StatusLine.css';

const StatusLine = (props) => (
  <div className="c-status-line u-font-size--saya">
    {props.children}
  </div>
);

export default StatusLine;
