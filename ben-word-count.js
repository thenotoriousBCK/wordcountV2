'use babel';

import BenWordCountView from './ben-word-count-view';
import { CompositeDisposable } from 'atom';

export default {

  benWordCountView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.benWordCountView = new BenWordCountView(state.benWordCountViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.benWordCountView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ben-word-count:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.benWordCountView.destroy();
  },

  serialize() {
    return {
      benWordCountViewState: this.benWordCountView.serialize()
    };
  },

  toggle() {
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide()
    } else {
      const editor = atom.workspace.getActiveTextEditor();
      const words = editor.getText().split(/\s+/).length
      this.benWordCountView.setCount(words);
      this.modalPanel.show();
    }
  }

};
