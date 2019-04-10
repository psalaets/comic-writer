import React from 'react';
import './TooltipPopover.css';

const TooltipPopover = props => (
  <div className={`
    c-tooltip-popover
    ${props.hidden ? 'c-tooltip-popover--hidden' : false}
    ${props.noWrap ? 'c-tooltip-popover--no-wrap' : false}
  `}>
    {props.children}
  </div>
);

export default TooltipPopover;
