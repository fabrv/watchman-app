import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './pages/Layout'
import { TeamPage } from './pages/TeamPage'
import { LandingPage } from './pages/LandingPage'
import { useAuth0 } from '@auth0/auth0-react'

function App () {
  const { isAuthenticated } = useAuth0()

  if (!isAuthenticated) {
    return <LandingPage />
  }

  return (
    <Layout>
      <Routes>
        <Route path='/' element={<TeamPage />} />
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
}

export default App
