import React, { Component } from 'react';
import './App.css';

import Writer from './components/writer/Writer';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Writer />
      </div>
    );
  }
}

export default App;
