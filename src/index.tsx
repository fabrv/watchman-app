import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

const domain = process.env.REACT_APP_AUTH_DOMAIN || ''
const clientId = process.env.REACT_APP_AUTH_CLIENT_ID || ''
const scope = process.env.REACT_APP_AUTH_SCOPE || ''

console.log(`domain: ${domain}`, `clientId: ${clientId}`, `scope: ${scope}`)

ReactDOM.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    redirectUri={window.location.origin}
    audience={`https://${domain}/api/v2/`}
    scope={scope}
  >
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Auth0Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
