import { z } from 'zod';

// Schéma de validation pour l'enregistrement
export const registerSchema = z.object({
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(6, 'Min. 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => {
  // Au moins email ou téléphone
  return data.email || data.phone;
}, {
  message: 'Email ou téléphone requis',
  path: ['email'],
}).refine((data) => {
  // Les mots de passe doivent correspondre
  return data.password === data.confirmPassword;
}, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
});

// Schéma de validation pour la connexion
export const loginSchema = z.object({
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(1, 'Mot de passe requis'),
}).refine((data) => {
  // Au moins email ou téléphone
  return data.email || data.phone;
}, {
  message: 'Email ou téléphone requis',
  path: ['email'],
});

// Schéma de validation pour un projet
export const projectSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(200),
  description: z.string().max(1000).optional(),
});

// Schéma de validation pour une note
export const noteSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(200),
  description: z.string().max(5000).optional(),
});
