import React from 'react';
import ReactDOM from 'react-dom/client';
import { CloudinaryContext } from 'cloudinary-react';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CloudinaryContext cloudName="djyrs6m6v">
      <App />
    </CloudinaryContext>
  </React.StrictMode>
);
