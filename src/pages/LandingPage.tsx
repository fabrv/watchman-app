import { Container } from 'react-bootstrap'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

import { TopBar } from 'watchman-core'

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN
}
firebase.initializeApp(config)

// Configure FirebaseUI.
const uiConfig = {
  signInFlow: 'redirect',
  signInSuccessUrl: '/',

  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
}

export const LandingPage = () => {
  return (
    <div>
      <TopBar
        brand='⏲️ Watchman'
        showNav={false}
        variant='dark'
      />
      <Container fluid={true} className='content'>
        <h1>Welcome to Watchman</h1>
        <p>To do: Landing Page with features and pricing info</p>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
      </Container>
    </div>
  )
}
