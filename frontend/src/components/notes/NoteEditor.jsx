import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../services/projectService';
import { noteSchema } from '../../utils/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card, CardBody, CardHeader } from '../common/Card';
import { NoteAttachments } from './NoteAttachments';
import { X, Edit2, Save, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDateTime } from '../../utils/dateUtils';
import { toast } from 'sonner';

export const NoteEditor = ({ note, projectId, onClose }) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, watch } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: note.title,
      description: note.description || '',
    },
  });

  useEffect(() => {
    reset({
      title: note.title,
      description: note.description || '',
    });
  }, [note, reset]);

  const updateNoteMutation = useMutation({
    mutationFn: (data) => projectService.updateNote(note.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['project-notes', projectId]);
      queryClient.invalidateQueries(['projects']);
      toast.success('Note modifiée avec succès !');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification');
    },
  });

  const onSubmit = async (data) => {
    await updateNoteMutation.mutateAsync(data);
  };

  const title = watch('title');
  const description = watch('description');
  const hasChanges = title !== note.title || description !== note.description;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto"
    >
      <Card className="w-full max-w-2xl my-8">
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {isEditing ? 'Modifier la note' : 'Détails de la note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardBody className="space-y-6">
          {!isEditing ? (
            // Vue lecture
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {note.title}
                </h3>
              </div>

              {note.description && (
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                  <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {note.description}
                  </p>
                </div>
              )}

              {/* Infos de création/modification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-sm">
                  <p className="text-slate-600 dark:text-slate-400">Créée le</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {formatDateTime(note.created_at)}
                  </p>
                  {(note.created_by_email || note.created_by_phone) && (
                    <p className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <User className="w-3 h-3" />
                      {note.created_by_email || note.created_by_phone}
                    </p>
                  )}
                </div>

                {note.updated_at && note.updated_at !== note.created_at && (
                  <div className="text-sm">
                    <p className="text-slate-600 dark:text-slate-400">Dernière modification</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {formatDateTime(note.updated_at)}
                    </p>
                    {(note.updated_by_email || note.updated_by_phone) && (
                      <p className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <User className="w-3 h-3" />
                        {note.updated_by_email || note.updated_by_phone}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Attachements */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <NoteAttachments noteId={note.id} />
              </div>

              {/* Bouton d'édition */}
              <div className="flex gap-3 justify-end pt-4">
                <Button variant="secondary" onClick={onClose}>
                  Fermer
                </Button>
                <Button
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Modifier
                </Button>
              </div>
            </div>
          ) : (
            // Vue édition
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                {...register('title')}
                label="Titre"
                placeholder="Titre de la note"
                error={errors.title}
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  placeholder="Description détaillée..."
                  rows="6"
                  className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={!hasChanges}
                  className="gap-2"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </Button>
              </div>
            </form>
          )}
        </CardBody>
      </Card>
    </motion.div>
  );
};
