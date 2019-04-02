import React from 'react';
import './Drawer.css';

const Drawer = props => {
  return props.isOpen ?
    (<div className={`c-drawer ${props.propagateHeight ? 'c-drawer--propagate-height' : ''}`}>
      {props.children}
    </div>) :
    false;
};

export default Drawer;
