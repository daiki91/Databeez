import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import api from '../services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, Lock, CheckCircle, Mail, Calendar } from 'lucide-react';
import { formatDateTime } from '../utils/dateUtils';

const profileSchema = z.object({
  phone: z.string().optional().or(z.literal('')),
  password: z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password.length < 6) {
    return false;
  }
  return true;
}, {
  message: 'Le mot de passe doit contenir au moins 6 caractères',
  path: ['password'],
}).refine((data) => {
  if (data.password && data.password !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPhoneForm, setShowPhoneForm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const password = watch('password');
  const confirmPassword = watch('confirmPassword');

  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const updateData = {};
      if (data.phone) updateData.phone = data.phone;
      if (data.password) updateData.password = data.password;

      const response = await api.put('/auth/profile', updateData);
      return response.data;
    },
    onSuccess: (data) => {
      // Mettre à jour le localStorage avec le nouveau token
      localStorage.setItem('token', data.token);
      
      toast.success('Profil mis à jour avec succès !');
      reset();
      setShowPasswordForm(false);
      setShowPhoneForm(false);
      
      // Recharger les données utilisateur
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });

  const onSubmit = async (data) => {
    // Vérifier qu'au moins un champ est rempli
    if (!data.phone && !data.password) {
      toast.error('Veuillez remplir au moins un champ');
      return;
    }
    await updateProfileMutation.mutateAsync(data);
  };

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Bouton retour */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour au dashboard
      </button>

      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Mon Profil
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Gérez vos informations personnelles
        </p>
      </div>

      {/* Informations de base */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Informations de Base
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          {/* Email */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {user.email || 'Non défini'}
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>

          {/* Telefone */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-600 dark:text-slate-400">Téléphone</p>
              <p className="font-medium text-slate-900 dark:text-white">
                {user.phone || 'Non défini'}
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowPhoneForm(!showPhoneForm)}
            >
              {user.phone ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>

          {/* Mot de passe */}
          <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Lock className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <div className="flex-1">
              <p className="text-sm text-slate-600 dark:text-slate-400">Mot de passe</p>
              <p className="font-medium text-slate-900 dark:text-white">
                ••••••••••
              </p>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Changer
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Formulaire de modification du téléphone */}
      {showPhoneForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Modifier le Téléphone
              </h3>
            </CardHeader>
            <CardBody>
              <form
                onSubmit={handleSubmit((data) => {
                  onSubmit({ ...data, password: undefined, confirmPassword: undefined });
                })}
                className="space-y-4"
              >
                <Input
                  {...register('phone')}
                  label="Nouveau numéro de téléphone"
                  placeholder="Ex: +33 6 12 34 56 78"
                  error={errors.phone}
                  type="tel"
                />
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowPhoneForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Formulaire de modification du mot de passe */}
      {showPasswordForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Changer le Mot de Passe
              </h3>
            </CardHeader>
            <CardBody>
              <form
                onSubmit={handleSubmit((data) => {
                  onSubmit({ ...data, phone: undefined });
                })}
                className="space-y-4"
              >
                <Input
                  {...register('password')}
                  label="Nouveau mot de passe"
                  placeholder="Minimum 6 caractères"
                  error={errors.password}
                  type="password"
                />
                <Input
                  {...register('confirmPassword')}
                  label="Confirmer le mot de passe"
                  placeholder="Confirmez votre mot de passe"
                  error={errors.confirmPassword}
                  type="password"
                />
                {password && confirmPassword && password === confirmPassword && !errors.confirmPassword && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Les mots de passe correspondent</span>
                  </div>
                )}
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowPasswordForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Enregistrer
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {/* Section Sécurité */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Sécurité
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <span className="font-medium">💡 Conseil :</span> Changez régulièrement votre mot de passe pour sécuriser votre compte.
            </p>
          </div>
          <Button
            variant="danger"
            onClick={logout}
            className="w-full"
          >
            Se déconnecter
          </Button>
        </CardBody>
      </Card>
    </motion.div>
  );
};
