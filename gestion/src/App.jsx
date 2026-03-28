import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = process.env.REACT_APP_API_URL || "http://localhost:3000/api";

function App() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeProjectId, setActiveProjectId] = useState(null);

  const [authForm, setAuthForm] = useState({ email: "", phone: "", password: "" });
  const [newProject, setNewProject] = useState({ title: "", description: "" });
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [status, setStatus] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  async function loadProjects() {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API}/projects`, { headers });
      setProjects(data);
    } catch (err) {
      console.error(err);
      setStatus("Impossible de charger les projets");
    }
  }

  async function loadNotes(projectId) {
    if (!token) return;
    try {
      const { data } = await axios.get(`${API}/projects/${projectId}/notes`, { headers });
      setNotes(data);
    } catch (err) {
      console.error(err);
      setStatus("Impossible de charger les notes");
    }
  }

  useEffect(() => {
    if (token) {
      setStatus("Connecté");
      axios
        .get(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => setUser(data.user))
        .catch(() => setUser(null));
      loadProjects();
    }
  }, [token]);

  useEffect(() => {
    if (activeProjectId) loadNotes(activeProjectId);
  }, [activeProjectId]);

  const register = async () => {
    setStatus("Enregistrement...");
    try {
      await axios.post(`${API}/auth/register`, authForm);
      setStatus("Inscription réussie, connectez-vous");
    } catch (err) {
      setStatus(err.response?.data?.message || "Erreur inscription");
    }
  };

  const login = async () => {
    setStatus("Connexion...");
    try {
      const { data } = await axios.post(`${API}/auth/login`, authForm);
      setToken(data.token);
      setStatus("Connecté");
    } catch (err) {
      setStatus(err.response?.data?.message || "Erreur connexion");
    }
  };

  const addProject = async () => {
    if (!newProject.title) return setStatus("Titre requis");
    try {
      await axios.post(`${API}/projects`, newProject, { headers });
      setNewProject({ title: "", description: "" });
      loadProjects();
      setStatus("Projet créé");
    } catch (err) {
      setStatus(err.response?.data?.message || "Erreur création projet");
    }
  };

  const addNote = async () => {
    if (!activeProjectId || !newNote.title) return setStatus("Sélectionner projet + titre note requis");
    try {
      await axios.post(`${API}/projects/${activeProjectId}/notes`, newNote, { headers });
      setNewNote({ title: "", description: "" });
      loadNotes(activeProjectId);
      setStatus("Note ajoutée");
    } catch (err) {
      setStatus(err.response?.data?.message || "Erreur création note");
    }
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API}/notes/${id}`, { headers });
    setStatus("Note supprimée");
    loadNotes(activeProjectId);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setStatus("Déconnecté");
  };

  return (
    <div className="app">
      <h1>Databeez - Gestion de projets</h1>
      <p>{status}</p>

      {!token ? (
        <div className="auth-grid">
          <div>
            <h2>Inscription / Connexion</h2>
            <input placeholder="Email" value={authForm.email} onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })} />
            <input placeholder="Téléphone" value={authForm.phone} onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })} />
            <input type="password" placeholder="Mot de passe" value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} />
            <button onClick={register}>S'inscrire</button>
            <button onClick={login}>Se connecter</button>
          </div>
        </div>
      ) : (
        <>
          <button onClick={logout}>Se déconnecter</button>
          <div className="project-section">
            <h2>Projets</h2>
            <div className="form-row">
              <input placeholder="Titre projet" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
              <input placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
              <button onClick={addProject}>Ajouter projet</button>
            </div>
            <ul>
              {projects.map((p) => (
                <li key={p.id} onClick={() => setActiveProjectId(p.id)} className={activeProjectId === p.id ? "active" : ""}>
                  {p.title} ({new Date(p.created_at).toLocaleString()})
                </li>
              ))}
            </ul>
          </div>

          {activeProjectId && (
            <div className="notes-section">
              <h2>Notes du projet #{activeProjectId}</h2>
              <div className="form-row">
                <input placeholder="Titre note" value={newNote.title} onChange={(e) => setNewNote({ ...newNote, title: e.target.value })} />
                <input placeholder="Description" value={newNote.description} onChange={(e) => setNewNote({ ...newNote, description: e.target.value })} />
                <button onClick={addNote}>Ajouter note</button>
              </div>
              <ul>
                {notes.map((n) => (
                  <li key={n.id}>
                    <strong>{n.title}</strong> — {n.description} <button onClick={() => deleteNote(n.id)}>Supprimer</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;

