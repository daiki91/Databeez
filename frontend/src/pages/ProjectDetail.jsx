import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { noteSchema } from '../utils/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { History } from '../components/common/History';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { NoteAttachments } from '../components/notes/NoteAttachments';
import { NoteEditor } from '../components/notes/NoteEditor';
import { ArrowLeft, Plus, Trash2, Calendar, User, Edit2, Eye, Image as ImageIcon, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDateTime, formatDateShort } from '../utils/dateUtils';
import { toast } from 'sonner';
import apiClient from '../services/api';

const parseAttachments = (attachments) => {
  if (!attachments) return [];
  if (Array.isArray(attachments)) return attachments;
  if (typeof attachments === 'string') {
    try {
      const parsed = JSON.parse(attachments);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const [editingNote, setEditingNote] = useState(null);
  const [imagePopup, setImagePopup] = useState(null);

  // Récupérer les notes du projet
  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['project-notes', projectId],
    queryFn: () => projectService.getProjectNotes(projectId),
  });

  // Récupérer les informations du projet
  const { data: project } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await projectService.getProjects();
      return projects.find(p => p.id === parseInt(projectId));
    },
  });

  // Formulaire pour ajouter une note
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(noteSchema),
  });

  const createNoteMutation = useMutation({
    mutationFn: (data) => projectService.createNote(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project-notes', projectId]);
      queryClient.invalidateQueries(['projects']); // Invalider la liste des projets pour mettre à jour le notesCount
      toast.success('Note créée avec succès !');
      reset();
      setIsAddingNote(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: (noteId) => projectService.deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries(['project-notes', projectId]);
      queryClient.invalidateQueries(['projects']); // Invalider la liste des projets pour mettre à jour le notesCount
      toast.success('Note supprimée !');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const onSubmit = async (data) => {
    await createNoteMutation.mutateAsync(data);
  };

  const handlePreviewAttachment = async (attachment) => {
    try {
      const response = await apiClient.get(
        `/notes/${attachment.noteId}/attachments/${attachment.id}/download`,
        { responseType: 'blob' }
      );
      const blobUrl = URL.createObjectURL(response.data);
      if (attachment.fileType?.startsWith('image/')) {
        setImagePopup({
          url: blobUrl,
          fileName: attachment.fileName,
        });
      } else {
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      }
    } catch (error) {
      console.error('Erreur prévisualisation fichier:', error);
      toast.error("Impossible d'ouvrir la prévisualisation");
    }
  };

  const closeImagePopup = () => {
    if (imagePopup?.url) {
      URL.revokeObjectURL(imagePopup.url);
    }
    setImagePopup(null);
  };

  const handleDeleteNote = (noteId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      deleteNoteMutation.mutate(noteId);
    }
  };

  if (isLoading || !project) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Bouton retour et titre */}
      <div>
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour aux projets
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {project.description}
            </p>
          )}
        </div>
      </div>

      {/* Informations du projet */}
      <Card>
        <CardBody className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Créé le</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {formatDateTime(project.created_at)}
              </p>
            </div>
          </div>
          <Badge variant="primary">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </Badge>
        </CardBody>
      </Card>

      {/* Formulaire d'ajout de note */}
      {!isAddingNote ? (
        <Button
          onClick={() => setIsAddingNote(true)}
          className="w-full gap-2"
        >
          <Plus className="w-5 h-5" />
          Ajouter une note
        </Button>
      ) : (
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              Nouvelle note
            </h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('title')}
                label="Titre"
                placeholder="Ex: Avancée du développement"
                error={errors.title}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  placeholder="Décrivez l'avancée du projet..."
                  rows="4"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>
              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsAddingNote(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" isLoading={isSubmitting}>
                  Créer la note
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Onglets Notes / Historique */}
      <div>
        <div className="flex gap-4 mb-4 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'notes'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Notes ({notes.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'history'
                ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Historique
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'notes' && (
          <div>
            {notes.length === 0 ? (
              <Card>
                <CardBody className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Aucune note pour ce projet
                  </p>
                </CardBody>
              </Card>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {notes.map((note, i) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <Card className="hover:shadow-lg">
                        <CardBody>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                                  {note.title}
                                </h3>
                              </div>
                              
                              {note.description && (
                                <p className="text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap line-clamp-3">
                                  {note.description}
                                </p>
                              )}
                              
                              {/* Infos de création/modification */}
                              <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Créée: {formatDateShort(note.created_at)}
                                </div>
                                
                                {note.updated_at && note.updated_at !== note.created_at && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Modifiée: {formatDateShort(note.updated_at)}
                                  </div>
                                )}
                              </div>

                              {/* Attachements preview */}
                              {parseAttachments(note.attachments).length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {parseAttachments(note.attachments).slice(0, 3).map((attachment) => {
                                    const isImage = attachment.fileType?.startsWith('image/');
                                    return (
                                      <div
                                        key={attachment.id}
                                        className="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          {isImage ? (
                                            <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                                          ) : (
                                            <FileText className="w-4 h-4 text-red-500 shrink-0" />
                                          )}
                                          <span className="text-xs text-slate-700 dark:text-slate-300 truncate">
                                            {attachment.fileName}
                                          </span>
                                        </div>
                                        <button
                                          onClick={() => handlePreviewAttachment({ ...attachment, noteId: note.id })}
                                          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                                          title="Prévisualiser"
                                        >
                                          <Eye className="w-4 h-4" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                  {parseAttachments(note.attachments).length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{parseAttachments(note.attachments).length - 3} fichiers
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Boutons actions */}
                            <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                              <button
                                onClick={() => setEditingNote(note)}
                                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                title="Éditer la note"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                disabled={deleteNoteMutation.isPending}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                                title="Supprimer la note"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <Card>
            <CardBody>
              <History entityType="project" entityId={projectId} title="Historique du projet" />
            </CardBody>
          </Card>
        )}
      </div>

      {/* Modal de lecture/édition d'une note */}
      <AnimatePresence>
        {editingNote && (
          <NoteEditor
            note={editingNote}
            projectId={projectId}
            onClose={() => setEditingNote(null)}
          />
        )}
      </AnimatePresence>

      {/* Popup preview image */}
      <AnimatePresence>
        {imagePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeImagePopup}
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[90vh] w-full rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                  {imagePopup.fileName}
                </p>
                <button
                  onClick={closeImagePopup}
                  className="px-3 py-1.5 text-sm rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  Fermer
                </button>
              </div>
              <div className="p-2 bg-slate-950">
                <img
                  src={imagePopup.url}
                  alt={imagePopup.fileName}
                  className="w-full h-auto max-h-[78vh] object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
