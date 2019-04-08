import React from 'react';
import './Drawer.css';

const Drawer = props => {
  return props.isOpen ?
    (<aside className={`c-drawer ${props.propagateHeight ? 'c-drawer--propagate-height' : ''}`}>
      <h2 className="u-hide--visually">{props.title}</h2>
      {props.children}
    </aside>) :
    false;
};

export default Drawer;
