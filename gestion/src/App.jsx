import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Layout } from './components/layout/Layout';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import './styles/index.css';

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Route protégée
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

// Route protégée
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Pages publiques */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Pages protégées */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Projects />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:projectId"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ProjectDetail />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Router>
          <Toaster position="top-right" theme="system" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
              <button onClick={login} disabled={loading} className="primary">
                {loading ? "⏳" : "🔓"} Se connecter
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <button onClick={logout} className="logout-btn">🚪 Se déconnecter</button>

          <div className="project-section">
            <h2>📁 Projets</h2>
            <div className="form-row">
              <input
                placeholder="Titre du projet"
                value={newProject.title}
                onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                disabled={loading}
              />
              <input
                placeholder="Description"
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                disabled={loading}
              />
              <button onClick={addProject} disabled={loading || !newProject.title?.trim()}>
                {loading ? "⏳" : "➕"} Ajouter
              </button>
            </div>

            {projects.length === 0 ? (
              <p className="empty-state">Aucun projet. Créez-en un pour commencer!</p>
            ) : (
              <ul className="projects-list">
                {projects.map((p) => (
                  <li
                    key={p.id}
                    onClick={() => setActiveProjectId(p.id)}
                    className={activeProjectId === p.id ? "active" : ""}
                  >
                    <strong>{p.title}</strong>
                    {p.description && <span className="desc"> - {p.description}</span>}
                    <span className="date">{new Date(p.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {activeProjectId && (
            <div className="notes-section">
              <h2>📝 Notes du projet</h2>
              <div className="form-row">
                <input
                  placeholder="Titre de la note"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  disabled={loading}
                />
                <input
                  placeholder="Description"
                  value={newNote.description}
                  onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
                  disabled={loading}
                />
                <button onClick={addNote} disabled={loading || !newNote.title?.trim()}>
                  {loading ? "⏳" : "➕"} Ajouter
                </button>
              </div>

              {notes.length === 0 ? (
                <p className="empty-state">Aucune note dans ce projet</p>
              ) : (
                <ul className="notes-list">
                  {notes.map((n) => (
                    <li key={n.id}>
                      <div className="note-content">
                        <strong>{n.title}</strong>
                        {n.description && <p>{n.description}</p>}
                        <small>{new Date(n.created_at).toLocaleDateString()}</small>
                      </div>
                      <button onClick={() => deleteNote(n.id)} className="delete-btn">
                        🗑️ Supprimer
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

