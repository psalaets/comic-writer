import React from 'react';
import Button from '../button/Button';
import MenuBar from '../menu-bar/MenuBar';

type TopBarProps = {
  drawerOpen: boolean;
  onGuideClick: () => void;
  onInsightsClick: () => void;
};

export default function TopBar(props: TopBarProps) {
  const {
    onGuideClick,
    onInsightsClick,
    drawerOpen
  } = props;

  return (
    <MenuBar.Container primary>
      <h1 className="u-font-size--maria">Comic Writer <sup aria-hidden="true" className="u-font-size--saya">αlρhα</sup></h1>
      <MenuBar.Spacer />
      <Button onClick={onGuideClick} transparent>Guide</Button>
      <Button onClick={onInsightsClick} isActive={drawerOpen} transparent>Insights</Button>
    </MenuBar.Container>
  );
}
