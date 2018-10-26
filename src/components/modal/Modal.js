import React from 'react';
import './Modal.css';

import Button from '../button/Button'
import AriaModal from 'react-aria-modal';

const Modal = props => props.modalActive ? <AriaModal
  titleText={props.title}
  onExit={props.closeButtonOnClick}
  initialFocus="#close-modal"
  getApplicationNode={document.getElementById('app')}
  underlayClass="c-modal"
  dialogClass="c-modal__dialouge"
>
  <section className="c-modal__body">
    <h2 className="c-modal__title u-font-size--maria">{props.title}</h2>
    <div className="c-modal__content">
      {props.children}
    </div>
    <div className="c-modal__close">
      <Button id="close-modal" onClick={props.closeButtonOnClick}><span className="u-hide--visually">Close Modal</span>×</Button>
    </div>
  </section>
</AriaModal> : false;

export default Modal;
