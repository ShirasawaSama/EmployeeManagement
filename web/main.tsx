import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { SnackbarProvider } from 'notistack'

ReactDOM.createRoot(document.getElementById('root')!)
  .render(<SnackbarProvider maxSnack={3}><App /></SnackbarProvider>)
