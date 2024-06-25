import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './global.css';
import DMTOMAX from './DMTOMAX';
import { GlobalContext } from "./context/GlobalContext";
import { Config } from './api/configuration';

const ipcRenderer = window.require("electron").ipcRenderer;
const config = new Config(ipcRenderer, "C:\\Users\\User\\Desktop\\motion\\config.json");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GlobalContext.Provider value={{ config }}>
    <DMTOMAX />
  </GlobalContext.Provider>
);
