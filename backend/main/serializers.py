from rest_framework import serializers
from .models import User, AchatHistorique, ROLE_CHOICES

# --- Serializers pour l'Authentification et l'Inscription ---

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'inscription d'un nouvel utilisateur.
    """
    # Le champ est nécessaire pour que DRF le gère correctement lors de la création
    password = serializers.CharField(write_only=True)
    
    # Mappage du rôle à une valeur plus conviviale (P, C, I)
    role = serializers.ChoiceField(choices=ROLE_CHOICES)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')
        extra_kwargs = {'password': {'write_only': True}}
    
    # Méthode d'écriture (POST) : crée l'utilisateur et son compteur via le signal
    def create(self, validated_data):
        # 1. Création de l'utilisateur
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data['role']
        )
        # Note: Le Compteur sera créé automatiquement grâce au signal post_save !
        return user

# --- Serializer pour les Tranches ---
class TrancheDetailSerializer(serializers.Serializer):
    """
    Détail de la consommation et du coût pour chaque tranche tarifaire utilisée.
    """
    tranche_nom = serializers.CharField(max_length=50)
    # CHANGEMENT : DecimalField -> FloatField
    kwh_dans_tranche = serializers.FloatField(label="kWh consommés dans cette tranche")
    cout_ht_tranche = serializers.FloatField(label="Coût HT de la tranche")
    prix_unitaire_kwh = serializers.FloatField(label="Prix unitaire du kWh")


# --- Serializer pour la Répartition ---
class RepartitionSerializer(serializers.Serializer):
    """
    Détail de la répartition du montant total.
    """
    # CHANGEMENT : DecimalField -> FloatField
    montant_saisi_valide = serializers.FloatField(label="Montant total validé")
    redevance = serializers.FloatField()
    taxe_communale = serializers.FloatField()
    tva = serializers.FloatField()
    achat_energie_ht_total = serializers.FloatField(label="Total énergie HT")


# --- Serializer Principal de Sortie ---
class SimulationOutputSerializer(serializers.Serializer):
    """
    Serializer de sortie final pour l'endpoint de simulation.
    """
    # CHANGEMENT : DecimalField -> FloatField
    montant_saisi = serializers.FloatField(label="Montant FCFA entré")
    kwh_total_obtenus = serializers.FloatField(label="kWh totaux obtenus")
    
    # ... (le reste reste le même)
    repartition = RepartitionSerializer() 
    tranches_details = TrancheDetailSerializer(many=True)

# --- Serializers pour la Simulation ---

class SimulationInputSerializer(serializers.Serializer):
    """
    Input: Valide le montant saisi par le client pour la simulation.
    """
    montant_fcfa = serializers.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        min_value=100.00, # Montant minimum raisonnable
        label="Montant en FCFA à recharger"
    )

# --- Serializer pour l'Historique ---

class AchatHistoriqueSerializer(serializers.ModelSerializer):
    """
    Serializer pour afficher l'historique des achats/simulations.
    """
    # Afficher le numéro du compteur pour l'historique
    numero_compteur = serializers.CharField(source='compteur.numero_compteur', read_only=True)

    class Meta:
        model = AchatHistorique
        fields = ('numero_compteur', 'montant_fcfa', 'kwh_obtenus', 'date_achat', 'details_simulation')
        read_only_fields = fields # Ce sont des données historiques
    
# --- Serializer d'Output pour la Recommandation ---
class RecommandationOutputSerializer(serializers.Serializer):
    montant_suggere = serializers.FloatField(
        label="Montant d'achat suggéré (F CFA)"
    )
    duree_recommandee = serializers.FloatField(
        label="Durée de vie estimée pour ce montant (Jours)",
        required=False,
        allow_null=True
    )
    message = serializers.CharField(
        label="Explication de la recommandation"
    )
