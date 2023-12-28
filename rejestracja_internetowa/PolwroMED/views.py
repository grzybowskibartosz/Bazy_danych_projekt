from django.http import JsonResponse
from .models import Pacjent, Lekarz, Wizyta, Gabinet
from rest_framework import generics
from .serializers import PacjentSerializer, LekarzSerializer, GabinetSerializer, WizytaSerializer, UserSerializer
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.response import Response


from rest_framework.views import APIView



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