import React from 'react';
import './Drawer.css';

const Drawer = props => {
  return props.isOpen ?
    (<div className="c-drawer">
      {props.children}
    </div>) :
    false;
};

export default Drawer;
