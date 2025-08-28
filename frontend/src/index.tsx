import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WorkingApp from './WorkingApp';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WorkingApp />
  </React.StrictMode>
);
