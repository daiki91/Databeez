import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { registerSchema } from '../utils/schemas';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Toast } from './Toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Phone } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [contactMethod, setContactMethod] = useState('email');
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const emailValue = watch('email');
  const phoneValue = watch('phone');

  const onSubmit = async (data) => {
    try {
      const submittedData = {
        email: data.email || '',
        phone: data.phone || '',
        password: data.password,
      };

      await authRegister.mutateAsync(submittedData);

      setToast({
        message: 'Inscription réussie ! Veuillez vous connecter.',
        type: 'success',
      });
      
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Erreur lors de l\'inscription',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl mb-4 shadow-lg">
            <span className="text-3xl font-bold text-white">📊</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Databeez</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Gestion de Projets</p>
        </div>

        {/* Formulaire */}
        <Card className="shadow-xl">
          <CardHeader>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              S'inscrire
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Créez votre compte pour commencer
            </p>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Toggle Email/Téléphone */}
              <div className="flex gap-2 mb-6">
                <button
                  type="button"
                  onClick={() => setContactMethod('email')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    contactMethod === 'email'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod('phone')}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                    contactMethod === 'phone'
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  Téléphone
                </button>
              </div>

              {/* Email */}
              {contactMethod === 'email' && (
                <Input
                  {...register('email')}
                  type="email"
                  placeholder="votre@email.com"
                  label="Email"
                  error={errors.email}
                  autoComplete="email"
                />
              )}

              {/* Téléphone */}
              {contactMethod === 'phone' && (
                <Input
                  {...register('phone')}
                  type="tel"
                  placeholder="+33612345678"
                  label="Téléphone"
                  error={errors.phone}
                  autoComplete="tel"
                />
              )}

              {/* Mot de passe */}
              <div className="relative">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 caractères"
                  label="Mot de passe"
                  error={errors.password}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Confirmer mot de passe */}
              <div className="relative">
                <Input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirmer le mot de passe"
                  label="Confirmer le mot de passe"
                  error={errors.confirmPassword}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showConfirm ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Bouton */}
              <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full h-11"
                disabled={!emailValue && !phoneValue}
              >
                S'inscrire
              </Button>

              {/* Lien connexion */}
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Vous avez un compte ?{' '}
                <Link
                  to="/"
                  className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </motion.div>
    </div>
  );
};
