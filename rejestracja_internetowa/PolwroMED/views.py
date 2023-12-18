from django.http import JsonResponse
from .models import Pacjent, Lekarz, Wizyta, Gabinet
from rest_framework import generics
from .serializers import PacjentSerializer, LekarzSerializer, GabinetSerializer, WizytaSerializer
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

# @api_view(['POST'])
# @permission_classes([AllowAny])
# def rejestracja_pacjenta(request):
#     serializer = PacjentSerializer(data=request.data)
#     if serializer.is_valid():
#         user = User.objects.create_user(
#             username=serializer.validated_data['email'],
#             password=serializer.validated_data['haslo'],
#             email=serializer.validated_data['email'],
#         )
#         serializer.save(user=user)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RejestracjaView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = PacjentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
