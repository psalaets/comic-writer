import React from 'react';
import './Drawer.css';

const defaultProps = {
  propagateHeight: false
};

type DrawerProps = {
  propagateHeight?: boolean,
  isOpen: boolean,
  title: string,
  children: React.ReactNode
} & typeof defaultProps;

const Drawer = (props: DrawerProps) =>
  <aside className={`
    c-drawer
    ${props.propagateHeight ? 'c-drawer--propagate-height' : ''}
    ${props.isOpen ? 'c-drawer--is-open': ''}
  `}>
    <h2 className="u-hide--visually">{props.title}</h2>
    {props.children}
  </aside>;

Drawer.defaultProps = defaultProps;

export default Drawer;
