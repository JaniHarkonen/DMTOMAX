import React from 'react';
import ReactDOM from 'react-dom/client';
import DMTOMAX from './DMTOMAX';
import { GlobalContext } from "./context/GlobalContext";
import { Config } from './api/configuration';
import './index.css';
import './global.css';

const ipcRenderer = window.require("electron").ipcRenderer;
const config = new Config(ipcRenderer, process.cwd() + "\\config.json");
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GlobalContext.Provider value={{ config }}>
    <DMTOMAX />
  </GlobalContext.Provider>
);
