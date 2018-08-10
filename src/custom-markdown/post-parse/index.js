export default function postParse(parsed) {
  return addPanelCounts(parsed);
}

function addPanelCounts(parsed) {
  let currentPage;

  parsed.forEach(block => {
    if (block.type === 'page') {
      currentPage = block;
      currentPage.panelCount = 0;
    } else if (block.type === 'panel') {
      // there should always be a page before seeing a panel but it'd be nice to
      // not bomb out when you're just testing something, so this check is here
      if (currentPage) {
        currentPage.panelCount += 1;
      }
    }
  });

  return parsed;
}