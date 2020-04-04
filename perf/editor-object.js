const fs = require('fs');

export class EditorObject {
  constructor(page) {
    this.page = page;
    this.contentEditableHandle = null;
  }

  async getContentEditable() {
    if (!this.contentEditableHandle) {
      this.contentEditableHandle = await this.page.waitForSelector('.CodeMirror-code');
    }

    return this.contentEditableHandle;
  }

  async focus() {
    await this.goTo(0, 0);
  }

  async getLine(line) {
    const element = await this.getContentEditable();

    const lineElement = await element.$(`.CodeMirror-line:nth-child(${line + 1})`);
    if (!lineElement) {
      throw new Error(`Line ${line} does not exist`);
    }
    return lineElement;
  }

  async focusLine(line) {
    const lineElement = await this.getLine(line);
    await lineElement.click({
      position: {
        x: 0,
        y: 0
      }
    });

    return lineElement;
  }

  async moveCursorTo(line, character = 0) {
    const lineElement = await this.focusLine(line);
    const lineValue = await lineElement.evaluate(node => node.textContent);

    for (let i = 0; i < Math.min(character, lineValue.length); i++) {
      await lineElement.press('ArrowRight');
    }

    return lineElement;
  }

  async type(text, line, character = 0) {
    const lineElement = await this.moveCursorTo(line, character);
    await lineElement.type(text, {delay: 167});
  }

  async setValue(text) {
    await this.page.evaluate(text => window.cm.setValue(text), text);
  }

  async loadBitchPlanet() {
    await this.loadScript('sample-scripts/bitch-planet-3.txt');
  }

  async loadTet() {
    await this.loadScript('sample-scripts/tet-1.txt');
  }

  async loadScript(path) {
    const content = fs.readFileSync(path).toString('utf8');
    await this.setValue(content);
  }
}
