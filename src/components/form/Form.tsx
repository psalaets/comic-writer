import React from 'react';
import './Form.css';

type RootProps = {
  children: React.ReactNode
};

const Root = (props: RootProps) => <form className="c-form">{props.children}</form>

type FieldsetProps = {
  title: string;
  children: React.ReactNode
}

const Fieldset = (props: FieldsetProps) => (
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
