import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../services/projectService';
import { toast } from 'sonner';
import { FileUp, Trash2, FileIcon, File, Download, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiClient from '../../services/api';

export const NoteAttachments = ({ noteId }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [imageBlobUrls, setImageBlobUrls] = useState({});

  // Récupérer les attachements
  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ['note-attachments', noteId],
    queryFn: () => projectService.getNoteAttachments(noteId),
  });

  // Charger les images en blob URLs pour que les headers auth soient envoyés
  useEffect(() => {
    const loadImageBlobUrls = async () => {
      const images = attachments.filter(a => a.fileType.startsWith('image/'));
      const newBlobUrls = {};

      for (const img of images) {
        try {
          const response = await apiClient.get(
            `/notes/${noteId}/attachments/${img.id}/download`,
            { responseType: 'blob' }
          );
          newBlobUrls[img.id] = URL.createObjectURL(response.data);
        } catch (err) {
          console.error('Erreur chargement image:', err);
        }
      }

      setImageBlobUrls(newBlobUrls);
    };

    if (attachments.length > 0) {
      loadImageBlobUrls();
    }

    // Cleanup blob URLs on unmount
    return () => {
      Object.values(imageBlobUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [attachments, noteId]);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (file) => projectService.uploadNoteAttachment(noteId, file),
    onSuccess: () => {
      queryClient.invalidateQueries(['note-attachments', noteId]);
      queryClient.invalidateQueries(['project-notes']);
      toast.success('Fichier uploadé avec succès !');
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'upload');
      setIsUploading(false);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (attachmentId) => projectService.deleteNoteAttachment(noteId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries(['note-attachments', noteId]);
      queryClient.invalidateQueries(['project-notes']);
      toast.success('Fichier supprimé !');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar type de fichier
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Type de fichier non autorisé. Utilisez PDF ou images (PNG, JPEG, GIF, WEBP)');
      return;
    }

    // Valider taille (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 50MB)');
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const handleDownload = (attachment) => {
    apiClient
      .get(`/notes/${noteId}/attachments/${attachment.id}/download`, { responseType: 'blob' })
      .then((response) => {
        const blobUrl = URL.createObjectURL(response.data);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = attachment.fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      })
      .catch((error) => {
        console.error('Erreur téléchargement fichier:', error);
        toast.error("Impossible de télécharger le fichier");
      });
  };

  const handleView = (attachment) => {
    apiClient
      .get(`/notes/${noteId}/attachments/${attachment.id}/download`, { responseType: 'blob' })
      .then((response) => {
        const blobUrl = URL.createObjectURL(response.data);
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
      })
      .catch((error) => {
        console.error('Erreur visualisation fichier:', error);
        toast.error("Impossible d'afficher le fichier");
      });
  };

  const handleDelete = (attachment) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${attachment.fileName}" ?`)) {
      deleteMutation.mutate(attachment.id);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FileIcon className="w-5 h-5 text-blue-500" />;
    }
    if (fileType === 'application/pdf') {
      return <File className="w-5 h-5 text-red-500" />;
    }
    return <FileIcon className="w-5 h-5 text-slate-500" />;
  };

  const isImage = (fileType) => fileType.startsWith('image/');

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const images = attachments.filter(a => isImage(a.fileType));
  const documents = attachments.filter(a => !isImage(a.fileType));

  return (
    <div className="space-y-4">
      {/* Upload section */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.png,.jpg,.jpeg,.gif,.webp"
          className="hidden"
          disabled={isUploading}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || uploadMutation.isPending}
          className="w-full px-4 py-2 bg-primary-50 dark:bg-primary-900/20 border-2 border-dashed border-primary-200 dark:border-primary-800 rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
        >
          <FileUp className="w-5 h-5" />
          {isUploading ? 'Upload en cours...' : 'Ajouter un fichier PDF ou image'}
        </button>
      </div>

      {/* Images gallery */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <AnimatePresence>
              {images.map((attachment, index) => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="relative group rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"
                >
                  {imageBlobUrls[attachment.id] ? (
                    <img
                      src={imageBlobUrls[attachment.id]}
                      alt={attachment.fileName}
                      className="w-full h-24 object-cover cursor-pointer hover:brightness-75 transition-all"
                      onClick={() => setPreviewImage(attachment)}
                    />
                  ) : (
                    <div className="w-full h-24 bg-slate-200 dark:bg-slate-700 animate-pulse" />
                  )}
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={() => setPreviewImage(attachment)}
                      className="p-1.5 bg-slate-700 text-white rounded transition-colors hover:bg-slate-800"
                      title="Voir"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="p-1.5 bg-blue-600 text-white rounded transition-colors hover:bg-blue-700"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(attachment)}
                      disabled={deleteMutation.isPending}
                      className="p-1.5 bg-red-600 text-white rounded transition-colors hover:bg-red-700 disabled:opacity-50"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Documents list */}
      {documents.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Documents ({documents.length})
          </h4>
          <div className="space-y-2">
            <AnimatePresence>
              {documents.map((attachment, index) => (
                <motion.div
                  key={attachment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getFileIcon(attachment.fileType)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {attachment.fileName}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => handleView(attachment)}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded transition-colors"
                      title="Visualiser"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(attachment)}
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded transition-colors"
                      title="Télécharger"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(attachment)}
                      disabled={deleteMutation.isPending}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded transition-colors disabled:opacity-50"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {!isLoading && attachments.length === 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
          Aucun fichier attaché
        </p>
      )}

      {/* Image preview modal */}
      <AnimatePresence>
        {previewImage && imageBlobUrls[previewImage.id] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewImage(null)}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[90vh] w-full"
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-2 rounded-full shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={imageBlobUrls[previewImage.id]}
                alt={previewImage.fileName}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
                <button
                  onClick={() => handleDownload(previewImage)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
