import { PAGE } from '../../types';

export function create(cm) {
  let widgets = [];

  return {
    update(stats) {
      cm.operation(() => {
        // clear existing widgets
        widgets.forEach(widget => widget.clear());

        // add new widgets
        widgets = stats
          .filter(tuple => tuple.type === PAGE)
          .map(page => cm.addLineWidget(page.lineNumber - 1, node(page.panelCount)));
      });

      cm.refresh();
    }
  };
}

function node(panelCount) {
  const div = document.createElement('div');
  div.classList.add('panel-count');

  const label = panelCount === 1 ? 'panel' : 'panels';
  div.textContent = `(${panelCount} ${label})`;

  return div;
}