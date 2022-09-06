import './App.css';

import React from 'react';

import PassiveButton from './PassiveButton'
import Cookies from 'js-cookie'
import { useEffect } from 'react';
import { Link } from "react-router-dom";

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
