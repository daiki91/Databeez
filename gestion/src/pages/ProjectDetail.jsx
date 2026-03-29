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
import { ArrowLeft, Plus, Trash2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDateTime, formatDateShort } from '../utils/dateUtils';
import { toast } from 'sonner';

export const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');

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
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 dark:text-white">
                                {note.title}
                              </h3>
                              {note.description && (
                                <p className="text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap">
                                  {note.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-3 text-sm text-slate-500 dark:text-slate-400">
                                <Calendar className="w-4 h-4" />
                                {formatDateShort(note.created_at)}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              disabled={deleteNoteMutation.isPending}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                              title="Supprimer la note"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
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
    </motion.div>
  );
};
