from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import (
    RegisterSerializer, SimulationInputSerializer, 
    SimulationOutputSerializer, AchatHistoriqueSerializer
)
from .models import AchatHistorique
from .services import SimulationService
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .ml_service import PredictionService # Importer le nouveau service
from .serializers import RecommandationOutputSerializer

# --- Vues d'Authentification ---

class RegisterAPIView(generics.CreateAPIView):
    """
    Endpoint pour l'inscription d'un nouvel utilisateur.
    """
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

# Note: Pour le login, nous utiliserons la vue JWT par défaut: TokenObtainPairView


# --- Vue de Simulation ---

class SimulationAPIView(APIView):
    
    def post(self, request, *args, **kwargs):
        # ... (Validation de l'input)
        input_serializer = SimulationInputSerializer(data=request.data)
        
        if input_serializer.is_valid():
            montant_saisi = input_serializer.validated_data['montant_fcfa']
            user = request.user

            try:
                service = SimulationService(user)
                # kwh_total, repartition, tranches_details sont maintenant des floats!
                kwh_total, repartition, tranches_details = service.simuler_recharge(montant_saisi)
                
                # --- PLUS AUCUNE CONVERSION MANUELLE NÉCESSAIRE ---
                
                final_response_data = {
                    # Les valeurs sont passées directement au Serializer
                    'montant_saisi': montant_saisi,
                    'kwh_total_obtenus': kwh_total,
                    'repartition': repartition,
                    'tranches_details': tranches_details
                }
                
                # Le Serializer gère la validation et la sérialisation en JSON sans erreur
                output_serializer = SimulationOutputSerializer(data=final_response_data)
                output_serializer.is_valid(raise_exception=True)
                
                return Response(output_serializer.data, status=status.HTTP_200_OK)
            
            except Exception as e:
                # Gère les erreurs de service
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        # ... (Gestion des erreurs de validation d'Input)
        return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- Vue d'Historique ---

class HistoriqueAPIView(generics.ListAPIView):
    """
    Endpoint pour lister l'historique des achats de l'utilisateur connecté.
    """
    serializer_class = AchatHistoriqueSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Filtre l'historique pour afficher uniquement celui du compteur de l'utilisateur connecté
        return AchatHistorique.objects.filter(compteur__user=self.request.user).select_related('compteur')


# pour la recommandation simple la durée de l'achat le prix recommandé
class RecommandationAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        user = request.user
        
        try:
            service = PredictionService(user)
            
            # 1. Prédiction du Montant
            montant_suggere = service.predire_montant_achat()
            
            # 2. Recommandation de Durée de Vie
            duree_estimee = service.recommander_duree_vie(montant_suggere)
            
            message = (
                f"Basé sur vos habitudes, nous vous recommandons {montant_suggere} F CFA."
            )
            if duree_estimee is not None:
                message += f" Cet achat devrait durer environ {duree_estimee} jours."
                
            response_data = {
                'montant_suggere': montant_suggere,
                'duree_recommandee': duree_estimee,
                'message': message
            }
            
            output_serializer = RecommandationOutputSerializer(data=response_data)
            output_serializer.is_valid(raise_exception=True)
            
            return Response(output_serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response(
                {"error": "Impossible de générer une recommandation pour le moment.", "details": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )