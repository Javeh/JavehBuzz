import './App.css';

import React from 'react';

import PassiveButton from './PassiveButton'
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.title = "JavehBuzz";
  })
  return (
    <div className="App">
      <PassiveButton> </PassiveButton>
    </div>
  );
}


export default App;
