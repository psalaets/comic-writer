import React from 'react';
import './Button.css';

const Button = (props) => (
  <button
    id={props.id}
    className={`
      c-button
      ${props.block ? 'c-button--block' : ''}
      ${props.isActive ? 'c-button--active' : ''}
    `}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

export default Button;
