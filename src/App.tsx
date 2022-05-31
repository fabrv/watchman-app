import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState } from 'react'
// import { Route, Routes } from 'react-router-dom'
import 'watchman-core/dist/App.css'
import './App.css'
// import { Layout } from './pages/Layout'
// import { TeamPage } from './pages/TeamPage'
import { LandingPage } from './pages/LandingPage'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { Layout } from './pages/Layout'
import { Route, Routes } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import configStore from './store/store'
import { setUser } from './store/userSlice'
import { sanitizeUser } from './models/User'
import { getAll, post } from './services/watchman'
import { MessageResponse, Role } from './models/Api'
// import { TeamPage } from './pages/TeamPage'

const App = () => {
  const [signinState, setSigninState] = useState(0)
  const store = configStore()

  const getRoles = async () => {
    const roles = await getAll<Role>('roles')
    console.log('roles', roles)
  }

  const routes = () => (
    <Layout>
      <Routes>
        <Route path='/' element={
          <div>
            <h1>My App</h1>
            <p>Welcome {firebase?.auth()?.currentUser?.displayName}! You are now signed-in!</p>
            <Button onClick={() => firebase.auth().signOut()}>Sign-out</Button>
            <Button onClick={getRoles}>Roles</Button>
          </div>
        } />
        {/* <Route path="/"
          element={
            <TrackPage
              labels={TrackPageLabels}
              availableProjects={availableProjects}
              availableTypes={availableTypes}
            />
          }
        />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/changelog" element={<ChangeLogPage />} />
        <Route path="/admin/times" element={<AdminTimesPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/teams" element={<AdminTeamsPage />} />
        <Route path="/admin/types" element={<AdminTypesPage />} /> */}
      </Routes>
    </Layout>
  )

  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(user => {
      const u = !!user
      if (u) {
        const sanitizedUser = sanitizeUser(user)
        store.dispatch(setUser(sanitizedUser))

        user.getIdToken(true).then(idToken => {
          if (!localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(sanitizedUser))

            // TODO: handle error
            post<MessageResponse>('session', { token: idToken })
          }
        }).catch(error => {
          // TODO: Handle error
          console.log(error)
        })
      } else {
        localStorage.removeItem('user')
      }
      setSigninState(u ? 2 : 1)
    })

    return () => unregisterAuthObserver()
  }, [])

  switch (signinState) {
    case 0:
      return <div></div>
    case 1:
      return <LandingPage />
    case 2:
      return routes()
  }

  return <div></div>
}

export default App
