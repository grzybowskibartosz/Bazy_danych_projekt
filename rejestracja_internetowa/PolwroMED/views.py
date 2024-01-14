from django.contrib.auth import get_user_model, authenticate, login
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from rest_framework import generics
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView, View

from .models import Pacjent, Lekarz, Gabinet, Wizyta
from .serializers import GabinetSerializer, UserSerializer, PacjentSerializer, LekarzSerializer, WizytaSerializer

User = get_user_model()

class GabinetyLekarzaView(APIView):
    def get(self, request, lekarz_id):
        lekarz = get_object_or_404(Lekarz, id=lekarz_id)
        gabinety = lekarz.gabinety.all()  # Użyj odniesienia do ManyToManyField

        if gabinety:
            serializer = GabinetSerializer(gabinety, many=True)

            # Wypisz informacje na konsoli
            print("Informacje o gabinetach lekarza:")
            for gabinet_data in serializer.data:
                print(f"Numer gabinetu: {gabinet_data['numer_gabinetu']}")

            return Response({'gabinety': serializer.data}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Lekarz nie jest przypisany do żadnego gabinetu.'},
                            status=status.HTTP_404_NOT_FOUND)
class RezerwacjaView(APIView):
    @authentication_classes([TokenAuthentication])
    @permission_classes([IsAuthenticated])
    @csrf_exempt
    def post(self, request, *args, **kwargs):
        try:
            data = request.data

            wizyta_data = {
                'data_i_godzina': data['data_i_godzina'],
                'lekarz': data['lekarz_id'],
                'pacjent': data['pacjent_id'],
                'opis': data['opis'],
                'gabinet': data['gabinet_id'],
                'status': 'zaplanowana',
            }

            wizyta_serializer = WizytaSerializer(data=wizyta_data)

            if wizyta_serializer.is_valid():
                wizyta_serializer.save()
                return Response(wizyta_serializer.data, status=status.HTTP_201_CREATED)
            else:
                print("Validation errors:", wizyta_serializer.errors)  # Dodano wypisanie błędów walidacji
                return Response(wizyta_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            print("Exception:", str(e))
            return Response({'error': 'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def dostepne_terminy(request, lekarz_id):
    lekarz = get_object_or_404(Lekarz, id=lekarz_id)
    serializer = LekarzSerializer(lekarz)
    return JsonResponse(serializer.data)

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
            return Response({'token': token.key})

        else:
            return Response({'error': 'Invalid credentials'}, status=401)

@csrf_exempt
def log_out_view(request):
    if request.method == 'POST':
        # Wyloguj użytkownika
        logout(request)
        return JsonResponse({'message': 'Wylogowano pomyślnie'})
    else:
        return JsonResponse({'error': 'Invalid request method'})


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


@csrf_exempt
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
            'status': wizyta.status,
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
            'opis': wizyta.opis,
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
            'opis': wizyta.opis,
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

def wizyty_pacjenta(request, pacjent_id):
    wizyty_zaplanowane = Wizyta.objects.filter(pacjent__id=pacjent_id, status='Zaplanowana')
    wizyty_odbyte = Wizyta.objects.filter(pacjent__id=pacjent_id, status='Odbyta')
    wizyty_anulowane = Wizyta.objects.filter(pacjent__id=pacjent_id, status='Anulowana')

    wizyty_zaplanowane_data = [
        {
            'id': wizyta.id,
            'data_i_godzina': wizyta.data_i_godzina,
            'lekarz': {
                'imie': wizyta.lekarz.imie,
                'nazwisko': wizyta.lekarz.nazwisko,
                'specjalizacja': wizyta.lekarz.specjalizacja,
            },
            'opis': wizyta.opis,
            'gabinet': wizyta.gabinet.numer_gabinetu,
            'status': wizyta.status,
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
            'opis': wizyta.opis,
            'diagnoza': wizyta.diagnoza,
            'przepisane_leki': wizyta.przepisane_leki,
            'notatki_lekarza': wizyta.notatki_lekarza,
            'status': wizyta.status,
        }
        for wizyta in wizyty_odbyte
    ]

    wizyty_anulowane_data = [
        {
            'id': wizyta.id,
            'data_i_godzina': wizyta.data_i_godzina,
            'lekarz': {
                'imie': wizyta.lekarz.imie,
                'nazwisko': wizyta.lekarz.nazwisko,
                'specjalizacja': wizyta.lekarz.specjalizacja,
            },
            'gabinet': wizyta.gabinet.numer_gabinetu,
            'opis': wizyta.opis,
            'diagnoza': wizyta.diagnoza,
            'przepisane_leki': wizyta.przepisane_leki,
            'notatki_lekarza': wizyta.notatki_lekarza,
            'status': wizyta.status,
        }
        for wizyta in wizyty_anulowane
    ]

    response_data = {
        'zaplanowane': wizyty_zaplanowane_data,
        'odbyte': wizyty_odbyte_data,
        'anulowane': wizyty_anulowane_data,
    }

    return JsonResponse(response_data, safe=False)

class AnulujWizyteView(APIView):
    def put(self, request, wizyta_id):
        try:
            wizyta = Wizyta.objects.get(id=wizyta_id)

            # Sprawdź, czy wizyta nie jest już anulowana lub odbyta
            if wizyta.status in ['anulowana', 'odbyta']:
                return Response({'status': 'Nie można anulować lub zmieniać statusu już anulowanej lub odbytej wizyty'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Zaktualizuj status wizyty na 'anulowana'
            wizyta.status = 'anulowana'
            wizyta.save()

            return Response({'status': 'Wizyta anulowana'}, status=status.HTTP_200_OK)
        except Wizyta.DoesNotExist:
            return Response({'status': 'Wizyta nie istnieje'}, status=status.HTTP_404_NOT_FOUND)

class CheckPeselView(View):
    def get(self, request, pesel):
        exists = Pacjent.objects.filter(pesel=pesel).exists()
        return JsonResponse({'exists': exists})

class EdytujOpisWizytyView(APIView):
    def put(self, request, wizyta_id):
        try:
            wizyta = Wizyta.objects.get(id=wizyta_id)

            # Sprawdź, czy wizyta nie jest już anulowana lub odbyta
            if wizyta.status in ['anulowana', 'odbyta']:
                return Response({'status': 'Nie można edytować już anulowanej lub odbytej wizyty'},
                                status=status.HTTP_400_BAD_REQUEST)

            opis = request.data.get('opis', '')# Pobierz dane z edycji z danych przesłanych w żądaniu


            # Zaktualizuj opis wizyty
            wizyta.opis = opis

            wizyta.save()

            return Response({'status': 'Opis wizyty zaktualizowany'}, status=status.HTTP_200_OK)
        except Wizyta.DoesNotExist:
            return Response({'status': 'Wizyta nie istnieje'}, status=status.HTTP_404_NOT_FOUND)

class ZmienStatusWizytyView(APIView):
    def put(self, request, wizyta_id):
        try:
            wizyta = Wizyta.objects.get(id=wizyta_id)

            # Sprawdź, czy wizyta nie jest już anulowana
            if wizyta.status == 'anulowana':
                return Response({'status': 'Nie można zmieniać statusu już anulowanej wizyty'},
                                status=status.HTTP_400_BAD_REQUEST)

            # Zaktualizuj status wizyty
            if wizyta.status == 'odbyta':
                # Jeżeli status to 'Odbyta', zmień na 'Zaplanowana'
                wizyta.status = 'zaplanowana'
            else:
                # W przeciwnym razie, zmień na 'Odbyta'
                wizyta.status = 'odbyta'

            wizyta.save()

            return Response({'status': 'Status wizyty zmieniony'}, status=status.HTTP_200_OK)
        except Wizyta.DoesNotExist:
            return Response({'status': 'Wizyta nie istnieje'}, status=status.HTTP_404_NOT_FOUND)

class EdytujPolaWizytyView(APIView):
    def put(self, request, wizyta_id):
        try:
            wizyta = Wizyta.objects.get(pk=wizyta_id)
            wizyta.diagnoza = request.data.get('diagnoza', wizyta.diagnoza)
            wizyta.przepisane_leki = request.data.get('przepisane_leki', wizyta.przepisane_leki)
            wizyta.notatki_lekarza = request.data.get('notatki_lekarza', wizyta.notatki_lekarza)
            wizyta.save()
            return Response({'message': 'Pola wizyty zaktualizowane pomyślnie.'})
        except Wizyta.DoesNotExist:
            return Response({'error': 'Wizyta nie istnieje.'}, status=status.HTTP_404_NOT_FOUND)

class EdytujWizyteView(APIView):
    def put(self, request, wizyta_id):
        try:
            wizyta = Wizyta.objects.get(id=wizyta_id)

            # Sprawdź, czy lekarz ma dostęp do edycji wizyty
            if not request.user.lekarz == wizyta.lekarz:
                return Response({'status': 'Brak uprawnień do edycji tej wizyty'},
                                status=status.HTTP_403_FORBIDDEN)

            # Pobierz dane z żądania
            diagnoza = request.data.get('diagnoza', '')
            przepisane_leki = request.data.get('przepisane_leki', '')
            notatki_lekarza = request.data.get('notatki_lekarza', '')

            # Zaktualizuj pola wizyty
            wizyta.diagnoza = diagnoza
            wizyta.przepisane_leki = przepisane_leki
            wizyta.notatki_lekarza = notatki_lekarza

            wizyta.save()

            # Zwróć potwierdzenie
            return Response({'status': 'Wizyta zaktualizowana'}, status=status.HTTP_200_OK)
        except Wizyta.DoesNotExist:
            return Response({'status': 'Wizyta nie istnieje'}, status=status.HTTP_404_NOT_FOUND)

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


