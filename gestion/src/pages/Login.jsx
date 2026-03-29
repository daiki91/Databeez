import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema } from '../utils/schemas';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import { Toast } from './Toast';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Phone, ChevronDown, Globe, Award, MapPin, Users, Briefcase, Zap, X } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [contactMethod, setContactMethod] = useState('email');
  const [toast, setToast] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const emailValue = watch('email');
  const phoneValue = watch('phone');

  const onSubmit = async (data) => {
    try {
      // Filtrer les champs vides
      const submittedData = {
        ...(contactMethod === 'email' && { email: data.email }),
        ...(contactMethod === 'phone' && { phone: data.phone }),
        password: data.password,
      };

      const result = await login.mutateAsync(submittedData);

      if (result.token) {
        setToast({ message: 'Connexion réussie !', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Erreur de connexion',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {/* Bouton À propos - Top Right */}
      <motion.button
        onClick={() => setShowAbout(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-6 right-6 px-4 py-2 bg-primary-600 dark:bg-primary-700 hover:bg-primary-700 dark:hover:bg-primary-600 text-white rounded-lg font-medium flex items-center gap-2 shadow-lg transition-colors z-40"
      >
        <Briefcase className="w-4 h-4" />
        <span className="hidden sm:inline">À propos</span>
      </motion.button>

      {/* Modal Popup with AnimatePresence */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50"
            onClick={() => setShowAbout(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 p-6 flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Databeez</h2>
                      <p className="text-primary-100 text-sm">1ère EdTech Panafricaine Data & IA</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAbout(false)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* About Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      Qui sommes-nous ?
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300">
                      Databeez est la première EdTech panafricaine spécialisée dans la formation aux domaines de la Data et de l'Intelligence Artificielle. Notre mission est de démocratiser l'accès à l'éducation technologique en Afrique.
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <Award className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Excellence</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Formations certifiées et de qualité</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Innovation</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Cursus actualisés et innovants</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <Users className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Communauté</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Réseau panafricain d'apprenants</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">Accessibilité</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">Formation accessible à tous</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                      Nous Contacter
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                          <a href="mailto:info@data-beez.com" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                            info@data-beez.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Téléphone</p>
                          <p className="text-slate-700 dark:text-slate-300">+221 77 838 78 87</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Site Web</p>
                          <a
                            href="https://www.data-beez.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
                          >
                            www.data-beez.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400 mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">Siège Social</p>
                          <p className="text-slate-700 dark:text-slate-300">Dakar, Sénégal</p>
                          <p className="text-slate-700 dark:text-slate-300">Filiale: France</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => setShowAbout(false)}
                      variant="secondary"
                      className="flex-1"
                    >
                      Fermer
                    </Button>
                    <a
                      href="https://www.data-beez.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="flex-1">
                        Visiter le site
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form in the center */}
      <div className="w-full max-w-md">
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
              Se connecter
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Bienvenue dans votre espace de gestion
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

              {/* Email Field */}
              {contactMethod === 'email' && (
                <Input
                  {...register('email', { required: true })}
                  type="email"
                  placeholder="votre@email.com"
                  label="Email"
                  icon={Mail}
                  error={errors.email?.message}
                />
              )}

              {/* Phone Field */}
              {contactMethod === 'phone' && (
                <Input
                  {...register('phone', { required: true })}
                  type="tel"
                  placeholder="+221 77 000 00 00"
                  label="Téléphone"
                  icon={Phone}
                  error={errors.phone?.message}
                />
              )}

              {/* Password Field */}
              <div className="relative">
                <Input
                  {...register('password', { required: true })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  label="Mot de passe"
                  icon={Eye}
                  error={errors.password?.message}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
              </Button>

              {/* Links */}
              <div className="flex flex-col gap-2 text-center">
                <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
                  Mot de passe oublié ?
                </Link>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Pas encore inscrit ?{' '}
                  <Link to="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                    S'inscrire
                  </Link>
                </p>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
