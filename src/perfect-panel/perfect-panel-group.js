class PerfectPanelGroup {
  constructor() {
    this.panels = {};
  }

  create(namespace, id) {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const panel = require(`../${namespace}-win`)();

    panel.changeGroup(this);

    this.panels[`${namespace}/${id}`] = panel;

    return panel;
  }

  destroy() {
    Object.keys(this.panels).forEach((key) => {
      this.panels[key].close();

      delete this.panels[key];
    });
  }
}

module.exports = PerfectPanelGroup;
