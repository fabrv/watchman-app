import 'bootstrap/dist/css/bootstrap.min.css'
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { AdminProjectsPage } from './pages/AdminProjectsPage'
import { AdminTeamsPage } from './pages/AdminTeamsPage'
import { AdminTypesPage } from './pages/AdminTypesPage'
import { AdminUsersPage } from './pages/AdminUsersPage'
import { ChangeLogPage } from './pages/ChangeLogPage'
import { Layout } from './pages/Layout'
import { ProjectsPage } from './pages/ProjectsPage'
import { TeamPage } from './pages/TeamPage'
import { TrackPage } from './pages/TrackPage'
import { Option } from './models/Option'
import { AdminTimesPage } from './pages/AdminTimesPage'

const TrackPageLabels = {
  project: 'Project',
  type: 'Type',
  description: 'Description',
  track: 'Track'
}

const availableProjects: Option[] = [
  { id: 1, name: 'Project 1' },
  { id: 2, name: 'Project 2' },
  { id: 3, name: 'Project 3' }
]

const availableTypes: Option[] = [
  { id: 1, name: 'Type 1' },
  { id: 2, name: 'Type 2' },
  { id: 3, name: 'Type 3' }
]

function App () {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TrackPage labels={TrackPageLabels} availableProjects={availableProjects} availableTypes={availableTypes} />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/changelog" element={<ChangeLogPage />} />
        <Route path="/admin/times" element={<AdminTimesPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/teams" element={<AdminTeamsPage />} />
        <Route path="/admin/types" element={<AdminTypesPage />} />
      </Routes>
    </Layout>
  )
}

export default App
