from decimal import Decimal, ROUND_HALF_UP
from .models import Compteur, Tarif, Tranche, AchatHistorique
from django.db import transaction

# Configure la précision des calculs
DECIMAL_PLACES = 2 

class SimulationService:
    """
    Service responsable d'exécuter la logique de simulation Woyofal :
    1. Déduire les frais fixes et la TVA.
    2. Appliquer la tarification progressive (Tranches) au montant restant.
    """
    def __init__(self, user):
        """Initialise le service avec le compteur de l'utilisateur."""
        try:
            self.compteur = Compteur.objects.select_related('type_compteur').get(user=user)
            self.tarif = self.compteur.type_compteur
            # Charger toutes les tranches ordonnées une seule fois
            self.tranches = Tranche.objects.filter(tarif=self.tarif).order_by('ordre')
        except (Compteur.DoesNotExist, Tarif.DoesNotExist):
            raise Exception("Compteur ou Tarif non trouvé pour cet utilisateur.")

    def _calculer_frais_fixes(self):
        """
        Calcule les frais fixes (redevance et taxe) en utilisant des floats.
        """
        if not self.tarif:
            raise Exception("Tarif non trouvé pour l'utilisateur.")
            
        # CONVERSION FORCÉE EN FLOAT de toutes les valeurs lues de la DB
        redevance = float(self.tarif.redevance_fixe)
        taxe = float(self.tarif.taxe_communale_fixe)
        
        frais_fixes_total = redevance + taxe
        
        # Toutes les sorties sont des floats
        return frais_fixes_total, redevance, taxe
    
    def _simuler_achat_kwh(self, montant_net_ht):
        """
        Applique la logique des tranches tarifaires pour convertir le montant
        net (hors taxes) en kWh, en utilisant des floats.
        """
        montant_net_ht = float(montant_net_ht) # Assurez-vous que l'input est un float
        
        kwh_total = 0.0
        montant_restant_pour_energie = montant_net_ht
        tranches_utilisees = []
        montant_energie_ht_total = 0.0

        for tranche in self.tranches:
            # CONVERSION FORCÉE EN FLOAT des valeurs lues des modèles
            prix_kwh = float(tranche.prix_kwh)
            kwh_max_tranche = float(tranche.limite_kwh_max)

            # Calculer le coût total pour remplir cette tranche
            cout_total_tranche = kwh_max_tranche * prix_kwh

            if montant_restant_pour_energie >= cout_total_tranche:
                # L'argent permet de remplir la tranche entièrement
                kwh_achetes_dans_tranche = kwh_max_tranche
                montant_depense = cout_total_tranche
                
                montant_restant_pour_energie -= montant_depense
            else:
                # L'argent ne permet pas de remplir la tranche, on dépense tout
                if prix_kwh > 0:
                    kwh_achetes_dans_tranche = montant_restant_pour_energie / prix_kwh
                else:
                    kwh_achetes_dans_tranche = 0.0
                    
                montant_depense = montant_restant_pour_energie
                montant_restant_pour_energie = 0.0
                
            if kwh_achetes_dans_tranche > 0.0:
                kwh_total += kwh_achetes_dans_tranche
                montant_energie_ht_total += montant_depense

                # Les valeurs sont déjà des floats et sont arrondies pour la sérialisation
                tranches_utilisees.append({
                    'tranche_nom': f"T{tranche.ordre} (<{round(kwh_max_tranche, 2)} kWh)",
                    'kwh_dans_tranche': round(kwh_achetes_dans_tranche, 3), # 3 décimales pour les kWh
                    'cout_ht_tranche': round(montant_depense, 2), # 2 décimales pour l'argent
                    'prix_unitaire_kwh': round(prix_kwh, 2)
                })

            if montant_restant_pour_energie <= 0.0:
                break
        
        # Retourner les totaux et les détails. Tous les nombres sont des floats.
        return kwh_total, montant_energie_ht_total, tranches_utilisees


    @transaction.atomic
    def simuler_recharge(self, montant_saisi):
        """
        Fonction principale pour exécuter la simulation complète, utilisant float.
        """
        montant_saisi = float(montant_saisi) 

        # 1. Calcul des frais fixes
        frais_fixes_total, redevance, taxe = self._calculer_frais_fixes()
        
        # Montant TOTAL (TTC) restant après déduction des frais fixes (925.0 F CFA)
        montant_energie_ttc = montant_saisi - frais_fixes_total 
    
        if montant_energie_ttc <= 0.0:
            raise ValueError("Le montant est insuffisant pour couvrir les frais fixes.")

        tva_rate = float(self.tarif.tva_pourcentage) / 100.0 if self.tarif.tva_pourcentage else 0.0
        montant_energie_ht = montant_energie_ttc / (1.0 + tva_rate)
        tva_montant = round(montant_energie_ht * tva_rate, 2)
        
        # 3. La simulation des tranches utilise le montant HT calculé
        # C'est la valeur de retour la plus importante
        kwh_total, montant_energie_ht_simule, tranches_details = self._simuler_achat_kwh(montant_energie_ht)
        
        # 4. Totalisation: Cette variable peut être supprimée car elle est redondante
        # montant_total_depense = frais_fixes_total + montant_energie_ht + tva_montant # À SUPPRIMER
        
        # 5. Préparation de la répartition
        repartition = {
            'montant_saisi_valide': round(montant_saisi, 2), 
            'redevance': round(redevance, 2),
            'taxe_communale': round(taxe, 2),
            'tva': tva_montant,
            # UTILISER LA VALEUR RENVOYÉE PAR LA SIMULATION DES TRANCHES
            'achat_energie_ht_total': round(montant_energie_ht_simule, 2) 
        }
            
        # 6. Enregistrement de l'historique
        # (Nous supposons ici que le modèle AchatHistorique accepte les floats)
        AchatHistorique.objects.create(
            compteur=self.compteur,
            montant_fcfa=montant_saisi,
            kwh_obtenus=kwh_total,
            details_simulation={
                'repartition': repartition,
                'tranches_details': tranches_details
            }
        )
        
        return kwh_total, repartition, tranches_details