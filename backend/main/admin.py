from django.contrib import admin
from .models import User, Compteur, Tarif, Tranche, AchatHistorique, RecommandationML
from django.contrib.auth.admin import UserAdmin

# --- 1. Enregistrement du Modèle User (avec champ 'role') ---

# Ajout du champ 'role' pour qu'il soit visible et modifiable dans l'admin
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('role',)}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('role',)}),
    )
admin.site.register(User, CustomUserAdmin)


# --- 2. Gestion des Tranches en ligne (Inline) ---
# Ceci permet de modifier les Tranches directement sur la page de modification du Tarif correspondant
class TrancheInline(admin.TabularInline):
    model = Tranche
    extra = 1 # Affiche 1 ligne vide en plus
    # Affiche les champs importants
    fields = ('ordre', 'limite_kwh_max', 'prix_kwh',) 


class TarifAdmin(admin.ModelAdmin):
    list_display = ('nom', 'redevance_fixe', 'taxe_communale_fixe', 'tva_pourcentage')
    search_fields = ('nom',)
    inlines = [TrancheInline] # Active l'édition des tranches sur cette page
    
admin.site.register(Tarif, TarifAdmin)


# --- 3. Autres Modèles ---

class CompteurAdmin(admin.ModelAdmin):
    list_display = ('numero_compteur', 'user', 'type_compteur', 'date_installation')
    search_fields = ('numero_compteur', 'user__username')
    list_filter = ('type_compteur',)
    
admin.site.register(Compteur, CompteurAdmin)


class AchatHistoriqueAdmin(admin.ModelAdmin):
    list_display = ('compteur', 'montant_fcfa', 'kwh_obtenus', 'date_achat')
    list_filter = ('date_achat', 'compteur__type_compteur')
    readonly_fields = ('details_simulation',) # Ne devrait pas être modifiable
    date_hierarchy = 'date_achat'
    
admin.site.register(AchatHistorique, AchatHistoriqueAdmin)
admin.site.register(RecommandationML) # Simple enregistrement