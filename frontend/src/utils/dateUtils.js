import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Formater une date au format lisible
 */
export const formatDate = (date) => {
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(parsed, 'd MMMM yyyy', { locale: fr });
  } catch {
    return 'Date invalide';
  }
};

/**
 * Formater une date en format court
 */
export const formatDateShort = (date) => {
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(parsed, 'dd/MM/yyyy', { locale: fr });
  } catch {
    return 'Date invalide';
  }
};

/**
 * Obtenir la distance relative (ex: "il y a 2 heures")
 */
export const formatDistanceRelative = (date) => {
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    return formatDistanceToNow(parsed, { locale: fr, addSuffix: true });
  } catch {
    return 'Date invalide';
  }
};

/**
 * Formater une date avec heure
 */
export const formatDateTime = (date) => {
  try {
    const parsed = typeof date === 'string' ? parseISO(date) : new Date(date);
    return format(parsed, 'd MMMM yyyy HH:mm', { locale: fr });
  } catch {
    return 'Date invalide';
  }
};
