import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './components/App'
import { Provider } from 'react-redux'
import store from './stores/store'
import 'primereact/resources/themes/lara-light-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Provider store={store}><App /></Provider>)
