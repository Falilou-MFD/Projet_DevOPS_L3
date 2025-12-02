from django.db import models
from django.contrib.auth.models import AbstractUser

# les role
ROLE_CHOICES = [
    ('P', 'Particulier'),
    ('C', 'Commercial'),
    ('I', 'Industriel'),
]

# la table des utilisateurs
class User(AbstractUser):
    """
    Modèle d'utilisateur étendu pour inclure le rôle Woyofal.
    """
    role = models.CharField(
        max_length=1,
        choices=ROLE_CHOICES,
        default='P',  # Par défaut Particulier
        verbose_name="Rôle Client"
    )

    class Meta:
        verbose_name = "Utilisateur Woyofal"
        verbose_name_plural = "Utilisateurs Woyofal"

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
# pour les tarifs
class Tarif(models.Model):
    """
    Définit les règles de tarification (frais fixes et TVA) pour un type de compteur (ex: BT, MT).
    """
    nom = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nom du Tarif (ex: BT Résidentiel)"
    )
    redevance_fixe = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        verbose_name="Redevance Fixe (FCFA)"
    )
    taxe_communale_fixe = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00,
        verbose_name="Taxe Communale Fixe (FCFA)"
    )
    tva_pourcentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=18.00,  # Exemple : 18.00%
        verbose_name="Taux de TVA (%)"
    )

    class Meta:
        verbose_name = "Règle de Tarif"
        verbose_name_plural = "Règles de Tarifs"

    def __str__(self):
        return self.nom

# les tranches
class Tranche(models.Model):
    """
    Définit les niveaux de prix (paliers de consommation) pour un Tarif donné.
    """
    tarif = models.ForeignKey(
        Tarif,
        on_delete=models.CASCADE,
        related_name='tranches'
    )
    limite_kwh_max = models.IntegerField(
        verbose_name="Limite kWh (max)"
    )
    prix_kwh = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Prix du kWh (FCFA)"
    )
    ordre = models.IntegerField(
        default=1,
        verbose_name="Ordre d'Application"
    )

    class Meta:
        verbose_name = "Tranche Tarifaire"
        verbose_name_plural = "Tranches Tarifaires"
        # Assure l'ordre d'application pour la simulation
        ordering = ['tarif', 'ordre'] 
        unique_together = ('tarif', 'ordre') 

    def __str__(self):
        return f"{self.tarif.nom} - T{self.ordre} (<{self.limite_kwh_max} kWh)"
        
# le compteur
class Compteur(models.Model):
    """
    Représente le compteur Woyofal spécifique lié à un utilisateur.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='compteur',
        verbose_name="Propriétaire"
    )
    numero_compteur = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Numéro de Compteur"
    )
    # Le type_compteur est lié aux règles Tarif
    type_compteur = models.ForeignKey(
        Tarif,
        on_delete=models.PROTECT,  # Protège contre la suppression d'un tarif utilisé
        verbose_name="Type de Tarif Appliqué"
    )
    date_installation = models.DateField(
        auto_now_add=True,
        verbose_name="Date de Création du Compteur"
    )

    class Meta:
        verbose_name = "Compteur Woyofal"
        verbose_name_plural = "Compteurs Woyofal"

    def __str__(self):
        return f"Compteur #{self.numero_compteur} ({self.user.username})"

# historique des achats
class AchatHistorique(models.Model):
    """
    Enregistre le détail de chaque simulation/achat.
    """
    compteur = models.ForeignKey(
        Compteur,
        on_delete=models.CASCADE,
        related_name='historique_achats'
    )
    montant_fcfa = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Montant Saisi (FCFA)"
    )
    kwh_obtenus = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        verbose_name="Total kWh Obtenus"
    )
    date_achat = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date de l'Achat"
    )
    # JSONField stocke les détails non structurés de la simulation (frais, tranches, etc.)
    details_simulation = models.JSONField(
        verbose_name="Détails de la Répartition (JSON)"
    )

    class Meta:
        verbose_name = "Achat Historique"
        verbose_name_plural = "Achats Historiques"
        ordering = ['-date_achat']

    def __str__(self):
        return f"{self.compteur.numero_compteur} - {self.montant_fcfa} FCFA"

# recommandations ML
class RecommandationML(models.Model):
    """
    Stocke les résultats pré-calculés du modèle de Machine Learning.
    """
    compteur = models.ForeignKey(
        Compteur,
        on_delete=models.CASCADE,
        related_name='recommandations'
    )
    mois = models.IntegerField()
    annee = models.IntegerField()
    montant_recommande = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name="Montant Recommandé (FCFA)"
    )
    date_calcul = models.DateTimeField(
        auto_now=True,  # Met à jour la date à chaque sauvegarde
        verbose_name="Date de Calcul ML"
    )
    
    # Nouveau champ crucial pour le ML
    duree_vie_jours = models.IntegerField(
        default=0,
        help_text="Durée réelle, en jours, de l'électricité achetée."
    )

    class Meta:
        verbose_name = "Recommandation ML"
        verbose_name_plural = "Recommandations ML"
        # S'assurer qu'il n'y a qu'une seule recommandation par mois/année pour un compteur
        unique_together = ('compteur', 'mois', 'annee') 
        ordering = ['-annee', '-mois']

    def __str__(self):
        return f"ML Recommandation pour {self.compteur.numero_compteur} en {self.mois}/{self.annee}"