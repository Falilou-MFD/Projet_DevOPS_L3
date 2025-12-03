from django.apps import AppConfig


class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'
    
    # AJOUTER CETTE MÉTHODE
    def ready(self):
        # Importe le module signals pour que les handlers soient enregistrés
        import main.signals

