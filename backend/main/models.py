from django.db import models
from django.contrib.auth.models import User


# -----------------------------
# TYPE DE COMPTEUR / COMPTEUR
# -----------------------------
class Compteur(models.Model):
    TYPE_CHOIX = [
        ('BT', 'Basse Tension'),
        ('MT', 'Moyenne Tension'),
        ('HT', 'Haute Tension'),
    ]

    numero = models.CharField(max_length=50, unique=True)
    utilisateur = models.ForeignKey(User, on_delete=models.CASCADE)
    type_compteur = models.CharField(max_length=2, choices=TYPE_CHOIX)

    def __str__(self):
        return f"{self.numero} - {self.type_compteur}"


# -----------------------------
# TARIFICATION
# -----------------------------
class Tarif(models.Model):
    """
    Exemple :
    - BT (basse tension)
    - MT (moyenne tension)
    - HT (haute tension)
    """
    type_compteur = models.CharField(max_length=2, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Tarif {self.type_compteur}"


# -----------------------------
# TRANCHES
# -----------------------------
class Tranche(models.Model):
    tarif = models.ForeignKey(Tarif, on_delete=models.CASCADE, related_name="tranches")
    ordre = models.PositiveIntegerField()  # 1, 2, 3...
    limite_kwh = models.PositiveIntegerField(null=True, blank=True)  
    # NULL = tranche illimitée (exemple la dernière tranche)
    prix_kwh = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['ordre']

    def __str__(self):
        return f"Tranche {self.ordre} ({self.tarif.type_compteur})"


# -----------------------------
# TAXES (REDEVANCE, COMMUNALE, TVA)
# -----------------------------
class Taxes(models.Model):
    redevance = models.DecimalField(max_digits=10, decimal_places=2)
    taxe_communale = models.DecimalField(max_digits=10, decimal_places=2)
    tva_pourcentage = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return "Taxes Woyofal"


# -----------------------------
# ACHATS (HISTORIQUE DES RECHARGES)
# -----------------------------
class Achat(models.Model):
    compteur = models.ForeignKey(Compteur, on_delete=models.CASCADE)
    montant = models.DecimalField(max_digits=12, decimal_places=2)
    kwh_obtenus = models.DecimalField(max_digits=12, decimal_places=2)
    date_achat = models.DateTimeField(auto_now_add=True)

    # Pour audit
    detail_simulation = models.JSONField(null=True, blank=True)  
    # ex: {"tranche1": {...}, "taxes": {...}}

    def __str__(self):
        return f"Achat {self.montant} FCFA - {self.compteur.numero}"


# -----------------------------
# CONSOMMATION MENSUELLE (POUR LE LINEPLOT)
# -----------------------------
class ConsommationMensuelle(models.Model):
    compteur = models.ForeignKey(Compteur, on_delete=models.CASCADE)
    mois = models.DateField()  # On stocke "2023-05-01", facile à grouper par mois
    kwh_consumes = models.DecimalField(max_digits=12, decimal_places=2)

    class Meta:
        unique_together = ('compteur', 'mois')
        ordering = ['mois']

    def __str__(self):
        return f"{self.compteur.numero} - {self.mois} : {self.kwh_consumes} kWh"
