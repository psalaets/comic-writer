const path = require('path');
const fs = require('fs');
const perfStats = require('./stats').perfStats;

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

  async preLoadBitchPlanet() {
    await this.preLoadScript('sample-scripts/bitch-planet-3.txt');
  }

  async preLoadTet() {
    await this.preLoadScript('sample-scripts/tet-1.txt');
  }

  async preLoadScript(repoRelativePath) {
    const absolutePath = path.resolve(__dirname, '..', repoRelativePath);
    const content = fs.readFileSync(absolutePath).toString('utf8');

    await this.setLocalStorage('comic-writer.script', content);
  }

  async setLocalStorage(key, value) {
    await this.page.evaluate(([k, v]) => {
      localStorage.setItem(k, v);
    }, [key, JSON.stringify(value)]);
  }

  async getDurations(measure) {
    return await this.page.evaluate(measure => {
      return performance.getEntriesByName(measure)
        .map(entry => entry.duration);
    }, measure);
  }

  async getStats(measureName) {
    const durations = await this.getDurations(measureName);
    return perfStats(durations);
  }
}
