import React from 'react';
import './Button.css';

const defaultProps = {
  block: false,
  transparent: false,
  isActive: false
};

type ButtonProps = {
  id?: string;
  block?: boolean;
  transparent?: boolean;
  isActive?: boolean;
  onClick: (event: any) => void;
  children: React.ReactNode;
} & typeof defaultProps;

const Button = (props: ButtonProps) => (
  <button
    id={props.id}
    className={`
      c-button
      ${props.block ? 'c-button--block' : ''}
      ${props.transparent ? 'c-button--transparent' : ''}
      ${props.isActive ? 'c-button--active' : ''}
    `}
    onClick={props.onClick}
  >
    {props.children}
  </button>
);

Button.defaultProps = defaultProps;

export default Button;
