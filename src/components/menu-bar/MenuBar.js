import React from 'react';
import './MenuBar.css';

const Container = props => (
  <nav className="c-menu-bar u-font-size--saya">
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
