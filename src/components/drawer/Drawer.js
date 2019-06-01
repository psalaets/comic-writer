import React from 'react';
import './Drawer.css';

const Drawer = props =>
  <aside className={`
    c-drawer
    ${props.propagateHeight ? 'c-drawer--propagate-height' : ''}
    ${props.isOpen ? 'c-drawer--is-open': ''}
  `}>
    <h2 className="u-hide--visually">{props.title}</h2>
    {props.children}
  </aside>

export default Drawer;
