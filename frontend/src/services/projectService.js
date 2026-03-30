import apiClient from './api';

export const projectService = {
  // Récupérer tous les projets
  getProjects: async () => {
    const response = await apiClient.get('/projects');
    return response.data || [];
  },

  // Créer un projet
  createProject: async (data) => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },

  // Modifier un projet (endpoint non implémenté côté backend)
  updateProject: async (id, data) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },

  // Supprimer un projet (endpoint non implémenté côté backend)
  deleteProject: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  // Récupérer les notes d'un projet
  getProjectNotes: async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}/notes`);
    return response.data || [];
  },

  // Créer une note
  createNote: async (projectId, data) => {
    const response = await apiClient.post(`/projects/${projectId}/notes`, data);
    return response.data;
  },

  // Modifier une note
  updateNote: async (noteId, data) => {
    const response = await apiClient.put(`/notes/${noteId}`, data);
    return response.data;
  },

  // Supprimer une note
  deleteNote: async (noteId) => {
    const response = await apiClient.delete(`/notes/${noteId}`);
    return response.data;
  },

  // ====== GESTION DES ATTACHEMENTS ======

  // Récupérer les attachements d'une note
  getNoteAttachments: async (noteId) => {
    const response = await apiClient.get(`/notes/${noteId}/attachments`);
    return response.data || [];
  },

  // Upload un fichier pour une note
  uploadNoteAttachment: async (noteId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post(`/notes/${noteId}/attachments`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Supprimer un attachement
  deleteNoteAttachment: async (noteId, attachmentId) => {
    const response = await apiClient.delete(`/notes/${noteId}/attachments/${attachmentId}`);
    return response.data;
  },

  // Obtenir l'URL pour télécharger/afficher un fichier
  getAttachmentDownloadUrl: (noteId, attachmentId) => {
    return `${apiClient.defaults.baseURL}/notes/${noteId}/attachments/${attachmentId}/download`;
  },
};
