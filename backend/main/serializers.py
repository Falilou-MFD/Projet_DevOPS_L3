from rest_framework import serializers
from .models import User, Compteur, Tarif, Tranche, Achat

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type']

class CompteurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Compteur
        fields = ['id', 'user', 'compteur_number', 'compteur_type', 'created_at']

class TarifSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tarif
        fields = ['id', 'tarif_type', 'redevance', 'taxe_commune', 'tva']

class TrancheSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tranche
        fields = ['id', 'tarif', 'tranche_number', 'prix', 'kwh']

class AchatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achat
        fields = ['id', 'compteur', 'montant', 'kwh_obtenu', 'date_achat']
