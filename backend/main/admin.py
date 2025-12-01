from django.contrib import admin
from .models import Compteur, Tarif, Tranche, Achat

# Register your models
admin.site.register(Compteur)
admin.site.register(Tarif)
admin.site.register(Tranche)

# Admin personnalisé pour Achat
@admin.register(Achat)
class AchatAdmin(admin.ModelAdmin):
    list_display = ('id', 'compteur', 'montant', 'kwh_obtenus', 'date_achat')  # champs réels
    search_fields = ('compteur__numero',)  # recherche par numéro de compteur
    list_filter = ('date_achat',)          # filtre par date d'achat
