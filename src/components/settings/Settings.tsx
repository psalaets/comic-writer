import React from 'react';
import './Settings.css';

import Form from '../form/Form'

const Settings = () => (
  <Form.Root>
    <Form.Fieldset title="Accessibility">
      <label htmlFor="Simple-Editor">
        <input type="checkbox" id="Simple-Editor"/>
        Simple Editor - <em>Changes from fancy editor to a simple text area, some features are disabled.</em>
      </label>
    </Form.Fieldset>
  </Form.Root>
);

export default Settings;
