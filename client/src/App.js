import React, { Component } from 'react';
import { Provider } from 'react-redux';
import {  } from 'react-redux';
import configureStore from './utils/configureStore';
import LightList from './LightList';
import logo from './hue.png';
import './App.css';

let store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Philips Hue Monitor</h1>
          </header>
          <p className="App-intro">
            Here is a list of active Hue lights connected to the base station.
          </p>
          <LightList />
        </div>
      </Provider>
    );
  }
}

export default App;
