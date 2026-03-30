import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { projectSchema } from '../utils/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardBody } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Search, Plus, Folder, MoreVertical, Image as ImageIcon, FileText, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDateShort } from '../utils/dateUtils';
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

export const Projects = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [imagePreviewUrls, setImagePreviewUrls] = useState({});

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  const { data: projectNotePreviews = {} } = useQuery({
    queryKey: ['projects-note-previews', projects.map((p) => `${p.id}-${p.notesCount || 0}`).join('|')],
    enabled: projects.length > 0,
    queryFn: async () => {
      const previews = {};
      const projectsWithNotes = projects.filter((project) => Number(project.notesCount) > 0);

      await Promise.all(
        projectsWithNotes.map(async (project) => {
          const notes = await projectService.getProjectNotes(project.id);
          let imageAttachment = null;
          let pdfAttachment = null;
          let totalFiles = 0;

          for (const note of notes) {
            const attachments = parseAttachments(note.attachments);
            totalFiles += attachments.length;

            for (const attachment of attachments) {
              if (!imageAttachment && attachment.fileType?.startsWith('image/')) {
                imageAttachment = { ...attachment, noteId: note.id };
              }
              if (!pdfAttachment && attachment.fileType === 'application/pdf') {
                pdfAttachment = { ...attachment, noteId: note.id };
              }
              if (imageAttachment && pdfAttachment) break;
            }
            if (imageAttachment && pdfAttachment) break;
          }

          previews[project.id] = {
            imageAttachment,
            pdfAttachment,
            totalFiles,
          };
        })
      );

      return previews;
    },
  });

  useEffect(() => {
    const loadImages = async () => {
      const nextBlobUrls = {};
      const entries = Object.entries(projectNotePreviews);

      await Promise.all(entries.map(async ([projectId, preview]) => {
        if (!preview?.imageAttachment) return;
        try {
          const response = await apiClient.get(
            `/notes/${preview.imageAttachment.noteId}/attachments/${preview.imageAttachment.id}/download`,
            { responseType: 'blob' }
          );
          nextBlobUrls[projectId] = URL.createObjectURL(response.data);
        } catch (error) {
          console.error('Erreur chargement preview image:', error);
        }
      }));

      setImagePreviewUrls((current) => {
        Object.values(current).forEach((url) => URL.revokeObjectURL(url));
        return nextBlobUrls;
      });
    };

    if (Object.keys(projectNotePreviews).length > 0) {
      loadImages();
    } else {
      setImagePreviewUrls((current) => {
        Object.values(current).forEach((url) => URL.revokeObjectURL(url));
        return {};
      });
    }

    return () => {
      Object.values(imagePreviewUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [projectNotePreviews]);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const createProjectMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      toast.success('Projet créé avec succès !');
      reset();
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });

  const onSubmit = async (data) => {
    await createProjectMutation.mutateAsync(data);
  };

  const openAttachmentPreview = async (event, attachment) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await apiClient.get(
        `/notes/${attachment.noteId}/attachments/${attachment.id}/download`,
        { responseType: 'blob' }
      );
      const blobUrl = URL.createObjectURL(response.data);
      window.open(blobUrl, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
    } catch (error) {
      console.error('Erreur ouverture aperçu fichier:', error);
      toast.error("Impossible d'ouvrir le fichier");
    }
  };

  // Filtrer et trier
  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Mes Projets
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {sorted.length} projet{sorted.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          Nouveau projet
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="recent">Plus récent</option>
          <option value="alphabetical">Alphabétique</option>
        </select>
      </div>

      {/* Grille de projets */}
      {sorted.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <Folder className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium">
              Aucun projet trouvé
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="mt-4">
              <Plus className="w-4 h-4" />
              Créer le premier projet
            </Button>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sorted.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Link to={`/projects/${project.id}`}>
                <Card className="hover:shadow-xl cursor-pointer h-full group">
                  <CardBody className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {project.title}
                        </h3>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="w-4 h-4 text-slate-500" />
                      </button>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 flex-1 line-clamp-3 mb-4">
                      {project.description || 'Sans description'}
                    </p>

                    {Number(project.notesCount) > 0 && projectNotePreviews[project.id] && (
                      <div className="mb-4 space-y-2">
                        {projectNotePreviews[project.id].imageAttachment && imagePreviewUrls[project.id] && (
                          <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                            <img
                              src={imagePreviewUrls[project.id]}
                              alt={projectNotePreviews[project.id].imageAttachment.fileName}
                              className="w-full h-24 object-cover"
                            />
                          </div>
                        )}

                        {projectNotePreviews[project.id].pdfAttachment && (
                          <div className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-4 h-4 text-red-500 shrink-0" />
                              <span className="text-xs text-slate-700 dark:text-slate-300 truncate">
                                {projectNotePreviews[project.id].pdfAttachment.fileName}
                              </span>
                            </div>
                            <button
                              onClick={(event) => openAttachmentPreview(event, projectNotePreviews[project.id].pdfAttachment)}
                              className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
                              title="Prévisualiser le PDF"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {projectNotePreviews[project.id].totalFiles > 0 && (
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>{projectNotePreviews[project.id].totalFiles} fichier(s) attaché(s)</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDateShort(project.created_at)}
                      </span>
                      <Badge variant="primary" size="sm">
                        {project.notesCount || 0} notes
                      </Badge>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de création */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Créer un nouveau projet"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            {...register('title')}
            label="Titre du projet"
            placeholder="Ex: Mon nouveau projet"
            error={errors.title}
          />
          <Input
            {...register('description')}
            label="Description (optionnel)"
            placeholder="Description du projet..."
            error={errors.description}
            as="textarea"
          />
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
            >
              Créer
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};
