import React, { Component } from 'react';
import './App.css';

import ConnectedWriter from './components/writer/ConnectedWriter';

class App extends Component {
  render() {
    return (
      <div className="App">
        <ConnectedWriter />
      </div>
    );
  }
}

export default App;
