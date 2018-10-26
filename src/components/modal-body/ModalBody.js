import React from 'react';
import './ModalBody.css';

import Button from '../button/Button'

const Container = props => (
  <section className="c-modal-body">
    <h2 className="c-modal-body__title u-font-size--maria">{props.title}</h2>
    <div className="c-modal-body__body">
      {props.children}
    </div>
    <div className="c-modal-body__close">
      <Button id={props.closeButtonId}onClick={props.closeButtonOnClick}><span className="u-hide--visually">Close Modal</span>×</Button>
    </div>
  </section>
);

export default Container;
