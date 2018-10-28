import React from 'react';
import './FormattingGuide.css';

import FormattingGuideData from '../../documentation/FormattingGuideData'

const GuideDataToJSX = data => data.map(a => [
  <dt className="c-formatting-guide__title u-font-size--saya">{a.title}</dt>,
  <dd className="c-formatting-guide__description">
    <pre className="c-formatting-guide__code">{a.code}</pre>
  </dd>
]);

const FormattingGuide = props => (
  <dl className="c-formatting-guide">
    {GuideDataToJSX(FormattingGuideData)}
  </dl>
);

export default FormattingGuide;
