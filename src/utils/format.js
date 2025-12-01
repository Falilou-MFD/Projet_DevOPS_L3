/**
 * Formatte un montant en CFA
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formatte un nombre avec des décimales
 */
export const formatNumber = (num, decimals = 2) => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Formatte une date
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

// ============================================
// src/utils/constants.js
// ============================================

export const USER_TYPES = {
  PARTICULIER: 'particulier',
  COMMERCIAL: 'commercial',
  INDUSTRIEL: 'industriel',
};

export const USER_TYPE_LABELS = {
  [USER_TYPES.PARTICULIER]: 'Particulier',
  [USER_TYPES.COMMERCIAL]: 'Commercial',
  [USER_TYPES.INDUSTRIEL]: 'Industriel',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  UNAUTHORIZED: 'Session expirée. Veuillez vous reconnecter.',
  INVALID_INPUT: 'Données invalides. Vérifiez votre saisie.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie !',
  SIMULATION_SUCCESS: 'Simulation effectuée avec succès',
  SAVE_SUCCESS: 'Recharge enregistrée avec succès',
};

export const MIN_AMOUNT = 500;
export const MAX_AMOUNT = 100000;
