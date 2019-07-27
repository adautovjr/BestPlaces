import React from 'react';
import './App.css';

import MyMapComponent from './components/Map';

function App() {
  return (
    <div className="App">
      <MyMapComponent isMarkerShown />
    </div>
  );
}

export default App;
