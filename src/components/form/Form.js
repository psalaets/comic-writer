import React from 'react';
import './Form.css';

const Root = props => <form className="c-form">{props.children}</form>

const Fieldset = props => (
  <fieldset className="c-form__fieldset">
    <legend className="c-form__legend">{props.title}</legend>
    {props.children}
  </fieldset>
);

const Form = {
  Root: Root,
  Fieldset: Fieldset
}

export default Form;
