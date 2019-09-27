import React from 'react';
import Button from '../button/Button';
import MenuBar from '../menu-bar/MenuBar';

export default function TopBar({ onGuideClick, onInsightsClick, onPdfClick, drawerOpen }) {
  return (
    <MenuBar.Container primary>
      <h1 className="u-font-size--maria">Comic Writer <sup aria-hidden="true" className="u-font-size--saya">αlρhα</sup></h1>
      <MenuBar.Spacer />
      <Button onClick={onGuideClick} transparent>Guide</Button>
      <Button onClick={onInsightsClick} isActive={drawerOpen} transparent>Insights</Button>
      <Button onClick={onPdfClick} transparent>PDF</Button>
    </MenuBar.Container>
  );
}
