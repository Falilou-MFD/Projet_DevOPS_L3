from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import User, Compteur, Tarif

# Définition du mapping entre le rôle de l'utilisateur (User.role) et le nom du Tarif.
# ASSUREZ-VOUS que ces noms existent dans la table Tarif !
ROLE_TO_TARIF_MAP = {
    'P': 'Basse Tension Résidentiel',
    'C': 'Moyenne Tension Commercial',
    'I': 'Haute Tension Industrie',
}

@receiver(post_save, sender=User)
def create_user_compteur(sender, instance, created, **kwargs):
    """
    Écoute la création d'un User et crée automatiquement un Compteur
    en y attachant le Tarif correspondant à son rôle.
    """
    # N'exécuter que lors de la CRÉATION d'un nouvel utilisateur
    if created:
        tarif_nom = ROLE_TO_TARIF_MAP.get(instance.role)

        if not tarif_nom:
            # Sécurité si un rôle non défini est créé
            print(f"ATTENTION: Rôle utilisateur inconnu ({instance.role}). Impossible d'assigner un tarif.")
            return

        try:
            # 1. Récupérer l'objet Tarif correspondant au rôle
            tarif_associe = Tarif.objects.get(nom=tarif_nom)
        except Tarif.DoesNotExist:
            # ERREUR CRITIQUE: Le setup de base n'est pas fait (les tarifs n'ont pas été insérés)
            print(f"ERREUR CRITIQUE: Le tarif '{tarif_nom}' n'existe pas. Veuillez insérer les données initiales de Tarif et Tranche.")
            return

        # 2. Créer l'instance de Compteur et la lier
        # Note: Le numéro de compteur est un exemple simple basé sur l'ID de l'utilisateur
        Compteur.objects.create(
            user=instance,
            numero_compteur=f"WOY{instance.id:06}",
            type_compteur=tarif_associe,
        )

        print(f"Compteur WOY{instance.id:06} créé pour l'utilisateur {instance.username} avec le tarif {tarif_nom}.")