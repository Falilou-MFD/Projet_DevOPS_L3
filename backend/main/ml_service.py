# simulateur/ml_service.py

# Nécessaire pour simuler l'achat de kWh afin d'estimer la durée de vie
from .services import SimulationService 

# Suppression des imports inutilisés (Avg, F, ExpressionWrapper, AchatHistorique)

class PredictionService:
    """
    Fournit des recommandations de montant d'achat et de durée de vie 
    basées sur des règles conditionnelles simples (IF/ELSE) liées au type de compteur.
    """
    def __init__(self, user):
        self.user = user
        
        # --- Détermination du type d'utilisateur et des règles ---
        try:
            # Tente d'accéder à la relation inverse Compteur de l'utilisateur
            compteur = user.compteur
            # Accède au type_compteur, avec 'Particulier' comme valeur de secours
            self.type_utilisateur = getattr(compteur, 'type_compteur', 'Particulier')
        except AttributeError:
            # Si l'utilisateur n'a pas de compteur associé (cas limite)
            self.type_utilisateur = 'Particulier' 
        
        # --- Définition des RÈGLES Fictives (Règles IF/ELSE) ---
        if self.type_utilisateur == 'Industriel':
            # Règle 1: Montant d'achat suggéré élevé
            self.montant_suggere_base = 25000.0  
            # Règle 2: Consommation quotidienne élevée
            self.conso_quotidienne_kwh = 40.0     
        elif self.type_utilisateur == 'Particulier':
            # Règle 1: Montant d'achat suggéré standard
            self.montant_suggere_base = 5000.0   
            # Règle 2: Consommation quotidienne standard
            self.conso_quotidienne_kwh = 10.0      
        else:
            # Règle de secours pour tout autre type
            self.montant_suggere_base = 3000.0
            self.conso_quotidienne_kwh = 7.0


    # --- 1. Logique : Prédiction du Montant d'Achat (Basée sur la Règle) ---
    def predire_montant_achat(self):
        """
        Retourne le montant prédit selon la règle définie dans __init__.
        """
        # AUCUN self.historique n'est utilisé
        return self.montant_suggere_base


    # --- 2. Logique : Recommandation de Durée de Vie (Basée sur la Règle) ---
    def recommander_duree_vie(self, montant_saisi):
        """
        Estime la durée de vie en jours en utilisant la consommation quotidienne définie par les règles.
        """
        if montant_saisi <= 0:
            return 0.0
            
        # 1. Obtenir les kWh qui seraient achetés avec le montant saisi via le SimulationService
        try:
            service_simulation = SimulationService(self.user)
            # Nous utilisons la simulation pour garantir l'exactitude des kWh selon la TARIFICATION
            kwh_achetes, _, _ = service_simulation.simuler_recharge(montant_saisi)
        except ValueError:
            # Gère l'exception si le montant saisi est insuffisant pour couvrir les frais fixes
            return None 
        except Exception:
            # Gère toute autre erreur de simulation (tarif manquant, etc.)
            return None
            
        # 2. Calcul de la durée de vie estimée (en jours)
        # AUCUN self.historique n'est utilisé
        if self.conso_quotidienne_kwh > 0:
            duree_estimee_jours = kwh_achetes / self.conso_quotidienne_kwh
        else:
            duree_estimee_jours = 0.0
        
        return round(duree_estimee_jours, 1)