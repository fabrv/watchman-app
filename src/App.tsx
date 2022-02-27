import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, Route, Routes } from 'react-router-dom';
import './App.css';
import { AdminProjectsPage } from './pages/AdminProjectsPage';
import { AdminTeamsPage } from './pages/AdminTeamsPage';
import { AdminTypesPage } from './pages/AdminTypesPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { ChangeLogPage } from './pages/ChangeLogPage';
import { Layout } from './pages/Layout';
import { ProjectsPage } from './pages/ProjectsPage';
import { TeamPage } from './pages/TeamPage';
import { TrackPage } from './pages/TrackPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<TrackPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/changelog" element={<ChangeLogPage />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/teams" element={<AdminTeamsPage />} />
        <Route path="/admin/types" element={<AdminTypesPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
