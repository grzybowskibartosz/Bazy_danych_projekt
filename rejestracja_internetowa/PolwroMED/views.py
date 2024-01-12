from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_http_methods
from rest_framework import generics, status
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from rest_framework import generics
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Pacjent, Lekarz, Gabinet, Wizyta
from .serializers import GabinetSerializer, UserSerializer, PacjentSerializer, LekarzSerializer, WizytaSerializer

from .models import Lekarz, Gabinet
from .models import Pacjent, Wizyta
from .serializers import GabinetSerializer, UserSerializer, PacjentSerializer, LekarzSerializer
from .serializers import WizytaSerializer



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
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                # Dodaj inne informacje o użytkowniku, które chcesz przekazać
            }

            # Pobierz token CSRF
            csrf_token = get_token(request)

            # Ustaw nagłówek CSRF Token w odpowiedzi
            response = Response({'token': token.key, 'user': user_data})
            response['X-CSRFToken'] = csrf_token

            return response
        else:
            return Response({'error': 'Invalid credentials'}, status=401)
class logout_view(APIView):
    def post(self, request):
        logout(request)
        response = JsonResponse({'detail': 'Successfully logged out'})
        response["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response["Access-Control-Allow-Credentials"] = "true"
        response.set_cookie('csrftoken', get_token(request))  # Dodaj tę linię
        return response
def csrf_token_view(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

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

        if hasattr(user, 'pacjent'):
            role = 'patient'
            user_data = PacjentSerializer(user.pacjent).data

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


@login_required
@require_GET
def moje_wizyty(request):
    print("Endpoint moje_wizyty called!")
    user = request.user
    pacjent = Pacjent.objects.get(user=user)
    moje_wizyty = Wizyta.objects.filter(pacjent=pacjent)

    wizyty_data = [
        {
            'id': wizyta.id,
            'opis': wizyta.opis,
            'data_i_godzina': wizyta.data_i_godzina.isoformat(),
        }
        for wizyta in moje_wizyty
    ]

    return JsonResponse({"wizyty": wizyty_data})

def wizyty_lekarza(request, lekarz_id):
    wizyty_zaplanowane = Wizyta.objects.filter(lekarz__id=lekarz_id, status='Zaplanowana')
    wizyty_odbyte = Wizyta.objects.filter(lekarz__id=lekarz_id, status='Odbyta')

    wizyty_zaplanowane_data = [
        {
            'id': wizyta.id,
            'data_i_godzina': wizyta.data_i_godzina,
            'pacjent': {
                'imie': wizyta.pacjent.imie,
                'nazwisko': wizyta.pacjent.nazwisko,
            },
            'gabinet': wizyta.gabinet.numer_gabinetu,
            'status': wizyta.status,
            # Dodaj więcej informacji o wizycie, jeśli to konieczne
        }
        for wizyta in wizyty_zaplanowane
    ]

    wizyty_odbyte_data = [
        {
            'id': wizyta.id,
            'data_i_godzina': wizyta.data_i_godzina,
            'pacjent': {
                'imie': wizyta.pacjent.imie,
                'nazwisko': wizyta.pacjent.nazwisko,
            },
            'gabinet': wizyta.gabinet.numer_gabinetu,
            'diagnoza': wizyta.diagnoza,
            'przepisane_leki': wizyta.przepisane_leki,
            'notatki_lekarza': wizyta.notatki_lekarza,
            'status': wizyta.status,
            # Dodaj więcej informacji o wizycie, jeśli to konieczne
        }
        for wizyta in wizyty_odbyte
    ]

    response_data = {
        'zaplanowane': wizyty_zaplanowane_data,
        'odbyte': wizyty_odbyte_data,
    }

    return JsonResponse(response_data, safe=False)

def wizyty_pacjenta(request, pacjent_id):
    wizyty_zaplanowane = Wizyta.objects.filter(pacjent__id=pacjent_id, status='Zaplanowana')
    wizyty_odbyte = Wizyta.objects.filter(pacjent__id=pacjent_id, status='Odbyta')

    wizyty_zaplanowane_data = [
        {
            'id': wizyta.id,
            'data_i_godzina': wizyta.data_i_godzina,
            'lekarz': {
                'imie': wizyta.lekarz.imie,
                'nazwisko': wizyta.lekarz.nazwisko,
                'specjalizacja': wizyta.lekarz.specjalizacja,

            },
            'gabinet': wizyta.gabinet.numer_gabinetu,
            # Dodaj więcej informacji o wizycie, jeśli to konieczne
        }
        for wizyta in wizyty_zaplanowane
    ]

    wizyty_odbyte_data = [
        {
            'id': wizyta.id,
            'data_i_godzina': wizyta.data_i_godzina,
            'lekarz': {
                'imie': wizyta.lekarz.imie,
                'nazwisko': wizyta.lekarz.nazwisko,
                'specjalizacja': wizyta.lekarz.specjalizacja,

            },
            'gabinet': wizyta.gabinet.numer_gabinetu,
            'diagnoza': wizyta.diagnoza,
            'przepisane_leki': wizyta.przepisane_leki,
            'notatki_lekarza': wizyta.notatki_lekarza,
            # Dodaj więcej informacji o wizycie, jeśli to konieczne
        }
        for wizyta in wizyty_odbyte
    ]

    response_data = {
        'zaplanowane': wizyty_zaplanowane_data,
        'odbyte': wizyty_odbyte_data,
    }

    return JsonResponse(response_data, safe=False)

@csrf_exempt
@require_POST
@login_required
def zmien_status_wizyty(request, wizyta_id):
    try:
        wizyta = Wizyta.objects.get(pk=wizyta_id)
    except Wizyta.DoesNotExist:
        return JsonResponse({'error': 'Wizyta o podanym ID nie istnieje'}, status=404)

    if wizyta.lekarz.user != request.user:
        return JsonResponse({'error': 'Nie masz uprawnień do zmiany statusu tej wizyty'}, status=403)

    nowy_status = request.POST.get('status')
    if nowy_status not in ['Zaplanowana', 'Odbyta']:
        return JsonResponse({'error': 'Nieprawidłowy status wizyty'}, status=400)

    wizyta.status = nowy_status
    wizyta.save()

    return JsonResponse({'success': True})



class NasiLekarzeView(APIView):
    def get(self, request, *args, **kwargs):
        lekarze = Lekarz.objects.all()
        serializer = LekarzSerializer(lekarze, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

@require_GET
def zajete_terminy_na_dzien(request, lekarz_id, rok, miesiac, dzien):
    try:
        lekarz = Lekarz.objects.get(pk=lekarz_id)
    except Lekarz.DoesNotExist:
        return JsonResponse({'error': 'Lekarz o podanym ID nie istnieje'}, status=404)

    terminy = Wizyta.objects.filter(
        lekarz=lekarz,
        data_i_godzina__year=rok,
        data_i_godzina__month=miesiac,
        data_i_godzina__day=dzien,
        status='zaplanowana'
    ).values('data_i_godzina')

    zajete_terminy = [termin['data_i_godzina'].isoformat() for termin in terminy]

    return JsonResponse({
        'zajete_terminy': zajete_terminy,
        'godziny_pracy': {
            'start': lekarz.godziny_pracy_start.isoformat(),
            'koniec': lekarz.godziny_pracy_koniec.isoformat(),
        },
    })
