import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from './store';
import { RootStoreContext } from './store/root-store-context';

const store = createStore();
store.script.loadScript();

ReactDOM.render(
  <RootStoreContext.Provider value={store}>
    <App />
  </RootStoreContext.Provider>,
  document.getElementById('root')
);
registerServiceWorker();
