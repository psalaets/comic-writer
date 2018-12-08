import { PAGE } from '../../types';

export function create(cm) {
  return {
    update(stats) {
      cm.getDoc().eachLine(lineHandle => {
        const lineInfo = cm.getDoc().lineInfo(lineHandle);
        if (lineInfo.widgets && lineInfo.widgets.length > 0) {
          lineInfo.widgets.forEach(widget => widget.clear());
        }
      });

      const pages = stats.filter(tuple => tuple.type === PAGE);
      pages.forEach(page => {
        cm.getDoc().addLineWidget(page.lineNumber - 1, node(page.panelCount));
      });
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