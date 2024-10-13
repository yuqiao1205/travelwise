import React from 'react'
import App from './App'
import { createRoot } from 'react-dom/client'
import { AuthContextProvider } from './context/authContext'
import 'bootstrap/dist/css/bootstrap.min.css'

const root = document.getElementById('root')
createRoot(root).render(
  <React.StrictMode>
    <AuthContextProvider>

      <App />

    </AuthContextProvider>
  </React.StrictMode>
)
