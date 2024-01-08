from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.decorators import authentication_classes
from rest_framework.permissions import BasePermission
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Pacjent, Lekarz, Wizyta, Gabinet
from .serializers import GabinetSerializer, WizytaSerializer, UserSerializer, PacjentSerializer, LekarzSerializer


class PacjentListCreateView(generics.ListCreateAPIView):
    queryset = Pacjent.objects.all()
    serializer_class = PacjentSerializer

class PacjentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Pacjent.objects.all()
    serializer_class = PacjentSerializer

class LekarzListCreateView(generics.ListCreateAPIView):
    queryset = Lekarz.objects.all()
    serializer_class = LekarzSerializer

class LekarzDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Lekarz.objects.all()
    serializer_class = LekarzSerializer

class GabinetListCreateView(generics.ListCreateAPIView):
    queryset = Gabinet.objects.all()
    serializer_class = GabinetSerializer

class GabinetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Gabinet.objects.all()
    serializer_class = GabinetSerializer

class WizytaListCreateView(generics.ListCreateAPIView):
    queryset = Wizyta.objects.all()
    serializer_class = WizytaSerializer

class WizytaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Wizyta.objects.all()
    serializer_class = WizytaSerializer

User = get_user_model()

class RejestracjaView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            user_data = {
                'username': data['email'],
                'email': data['email'],
                'password': data['haslo'],
                'first_name': data['imie'],
                'last_name': data['nazwisko'],
                'user_type': data.get('user_type', 'P'),  # Ustaw domyślnie jako pacjent

            }

            pacjent_data = {
                'imie': data['imie'],
                'nazwisko': data['nazwisko'],
                'pesel': data['pesel'],
                'data_urodzenia': data['data_urodzenia'],
                'adres': data['adres'],
                'inne_informacje': data.get('inne_informacje', ''),
            }

            user_serializer = UserSerializer(data=user_data)
            pacjent_serializer = PacjentSerializer(data=pacjent_data)

            if user_serializer.is_valid() and pacjent_serializer.is_valid():
                user = user_serializer.save()
                pacjent_serializer.save(user=user)
                return Response(user_serializer.data, status=status.HTTP_201_CREATED)
            errors = {}
            errors.update(user_serializer.errors)
            errors.update(pacjent_serializer.errors)
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Exception:", str(e))
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'token': token.key})
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)

class IsPatientOrDoctor(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return hasattr(user, 'pacjent') or hasattr(user, 'lekarz')

@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
class UserInfoView(APIView):
    permission_classes = [IsAuthenticated, IsPatientOrDoctor]

    def get_user_info(self, request):
        user = request.user
        print(f"User: {user}")
        if hasattr(user, 'pacjent'):
            role = 'patient'
            user_data = PacjentSerializer(user.pacjent).data

            # Dodaj informacje o wizytach pacjenta
            wizyty_odbyte = Wizyta.objects.filter(pacjent=user.pacjent, data_i_godzina__lt=timezone.now())
            wizyty_zaplanowane = Wizyta.objects.filter(pacjent=user.pacjent, data_i_godzina__gte=timezone.now())
            user_data['wizyty_odbyte'] = WizytaSerializer(wizyty_odbyte, many=True).data
            user_data['wizyty_zaplanowane'] = WizytaSerializer(wizyty_zaplanowane, many=True).data

        elif hasattr(user, 'lekarz'):
            role = 'doctor'
            user_data = LekarzSerializer(user.lekarz).data
            # Tutaj możesz dodać dodatkowe informacje dla lekarza

        else:
            role = 'unknown'
            user_data = {}

        return Response({'role': role, 'user_data': user_data})

    def get(self, request):
        response = self.get_user_info(request)
        return response


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_scheduled_visits(request):
    # Tutaj dodaj kod do pobierania informacji o zaplanowanych wizytach pacjenta
    # Możesz skorzystać z modelu Wizyta i zapytania do bazy danych
    scheduled_visits = Wizyta.objects.filter(pacjent=request.user.pacjent, status='Zaplanowana')

    # Następnie przekształć dane na format JSON i zwróć je w odpowiedzi
    data = [{'lekarz': visit.lekarz.imie_nazwisko(), 'data_i_godzina': visit.data_i_godzina,
             'gabinet': visit.gabinet.numer_gabinetu, 'opis': visit.opis} for visit in scheduled_visits]
    return Response(data)