import React from 'react';
import './MenuBar.css';

const Container = props => (
  <nav className={`u-font-size--billy c-menu-bar ${props.primary ? 'c-menu-bar--primary' : ''}`}>
    {props.children}
  </nav>
);
const Spacer = props => (
  <div className="c-menu-bar__spacer"/>
);

const MenuBar = {
  Container: Container,
  Spacer: Spacer
}

export default MenuBar;
