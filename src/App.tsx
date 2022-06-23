import 'bootstrap/dist/css/bootstrap.min.css'
import { useEffect, useState } from 'react'
import 'watchman-core/dist/App.css'
import './App.css'
import { LandingPage } from './pages/LandingPage'

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import { Layout } from './pages/Layout'
import { Route, Routes } from 'react-router-dom'
import { setUser } from './store/userSlice'
import { sanitizeUser } from './models/User'
import { deleteItem, post } from './services/watchman'
import { MessageResponse } from './models/Api'
import { TrackPage } from './pages/TrackPage'

import configStore from './store/store'
// import { TeamPage } from './pages/TeamPage'

const App = () => {
  const [signinState, setSigninState] = useState(0)
  const store = configStore()

  const routes = () => (
    <Layout>
      <Routes>
        <Route path="/"
          element={
            <TrackPage
              labels={TrackPageLabels}
              availableProjects={availableProjects}
              availableTypes={availableTypes}
            />
          }
        />
        {/* <Route path="/team" element={<TeamPage />} />
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
        if (localStorage.getItem('user')) {
          localStorage.removeItem('user')

          // TODO: handle error
          deleteItem<MessageResponse>('session')
        }
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
