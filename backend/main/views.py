#from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import User, Compteur, Tarif, Tranche, Achat
from .serializers import UserSerializer, CompteurSerializer, TarifSerializer, TrancheSerializer, AchatSerializer

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CompteurViewSet(viewsets.ModelViewSet):
    queryset = Compteur.objects.all()
    serializer_class = CompteurSerializer

class TarifViewSet(viewsets.ModelViewSet):
    queryset = Tarif.objects.all()
    serializer_class = TarifSerializer

class TrancheViewSet(viewsets.ModelViewSet):
    queryset = Tranche.objects.all()
    serializer_class = TrancheSerializer

class AchatViewSet(viewsets.ModelViewSet):
    queryset = Achat.objects.all()
    serializer_class = AchatSerializer

    @action(detail=False, methods=['post'])
    def simulate(self, request):
        """
        Simulation du montant -> kWh obtenu avec répartition des frais
        """
        montant = request.data.get('montant')
        compteur_id = request.data.get('compteur_id')
        
        if not montant or not compteur_id:
            return Response({'error': 'Montant et compteur_id sont requis'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            compteur = Compteur.objects.get(id=compteur_id)
            tarif = Tarif.objects.get(tarif_type=compteur.compteur_type)
            tranches = Tranche.objects.filter(tarif=tarif).order_by('tranche_number')
        except Compteur.DoesNotExist:
            return Response({'error': 'Compteur non trouvé'}, status=status.HTTP_404_NOT_FOUND)

        montant = float(montant)
        kwh_total = 0
        details_tranches = []

        for tranche in tranches:
            if montant <= 0:
                break
            prix_tranche = tranche.prix
            kwh_tranche = tranche.kwh
            if montant >= prix_tranche:
                kwh_total += kwh_tranche
                details_tranches.append({'tranche': tranche.tranche_number, 'kwh': kwh_tranche, 'prix': prix_tranche})
                montant -= prix_tranche
            else:
                kwh_obtenu = kwh_tranche * (montant / prix_tranche)
                kwh_total += kwh_obtenu
                details_tranches.append({'tranche': tranche.tranche_number, 'kwh': kwh_obtenu, 'prix': montant})
                montant = 0

        # Ajout redevance, taxe, TVA
        frais = {
            'redevance': tarif.redevance,
            'taxe_commune': tarif.taxe_commune,
            'tva': tarif.tva
        }

        return Response({
            'kwh_total': kwh_total,
            'details_tranches': details_tranches,
            'frais': frais
        })
