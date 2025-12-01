// ============================================
// src/utils/constants.js - VERSION CORRIGÉE
// ============================================

export const USER_TYPES = {
  PARTICULIER: 'particulier',
  COMMERCIAL: 'commercial',
  INDUSTRIEL: 'industriel',
};

export const USER_TYPE_LABELS = {
  particulier: 'Particulier',
  commercial: 'Commercial',
  industriel: 'Industriel',
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
