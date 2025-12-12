from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterAPIView, SimulationAPIView, HistoriqueAPIView, RecommandationAPIView

from django.http import JsonResponse

def health(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    # AUTHENTIFICATION (Utilisation de JWT Simple)
    path('auth/register/', RegisterAPIView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), # Génère access et refresh tokens
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Renouvelle le token

    # LOGIQUE MÉTIER
    path('simulation/', SimulationAPIView.as_view(), name='simulation'),
    path('historique/', HistoriqueAPIView.as_view(), name='historique'),
    
    # ML (Non implémenté ici, mais le chemin est prêt)
    path('ml/recommandation/', RecommandationAPIView.as_view(), name='ml-recommandation'),
    
    path("api/health/", health),
]