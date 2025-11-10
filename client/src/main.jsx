import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import StorePovider from './context/StorePovider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StorePovider>
    <>
      <App />
      <Toaster />
    </>
  </StorePovider>,
)

