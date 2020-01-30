import React from 'react';
import './MenuBar.css';

const defaultProps = {
  primary: false
};

type ContainerProps = {
  primary: boolean;
  children: React.ReactNode;
} & typeof defaultProps;

const Container = (props: ContainerProps) => (
  <nav className={`u-font-size--billy c-menu-bar ${props.primary ? 'c-menu-bar--primary' : ''}`}>
    {props.children}
  </nav>
);

Container.defaultProps = defaultProps;

const Spacer = () => (
  <div className="c-menu-bar__spacer"/>
);

const MenuBar = {
  Container: Container,
  Spacer: Spacer
}

export default MenuBar;
