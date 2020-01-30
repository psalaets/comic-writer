import React from 'react';
import './Modal.css';

import Button from '../button/Button'
import AriaModal from 'react-aria-modal';

type ModalProps = {
  title: string;
  closeButtonOnClick: () => void;
  children: React.ReactNode;
};

export default function Modal(props: ModalProps) {
  return (
    <AriaModal
      titleText={props.title}
      onExit={props.closeButtonOnClick}
      initialFocus="#close-modal"
      applicationNode={document.getElementById('app') as HTMLElement}
      underlayClass="c-modal"
      dialogClass="c-modal__dialouge"
    >
      <section className="c-modal__body">
        <h2 className="c-modal__title u-font-size--maria">{props.title}</h2>
        <div className="c-modal__content">
          {props.children}
        </div>
        <div className="c-modal__close">
          <Button id="close-modal" transparent onClick={props.closeButtonOnClick}>
            <span className="u-hide--visually">Close Modal</span>×
          </Button>
        </div>
      </section>
    </AriaModal>
  );
}
