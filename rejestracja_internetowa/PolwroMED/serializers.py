# serializers.py
from rest_framework import serializers
from .models import Pacjent, Lekarz, Gabinet, Wizyta
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']

class PacjentSerializer(serializers.ModelSerializer):
    user = UserSerializer(write_only=True)  # Dodaj to pole
    email = serializers.EmailField()
    haslo = serializers.CharField(write_only=True)
    class Meta:
        model = Pacjent
        fields = '__all__'

    def create(self, validated_data):
        # Wydziel dane dotyczące użytkownika
        user_data = {
            'username': validated_data['email'],
            'email': validated_data['email'],
            'password': validated_data['haslo'],
        }

        # Usuń pola 'email' i 'haslo' z danych dotyczących pacjenta
        del validated_data['email']
        del validated_data['haslo']

        # Stwórz użytkownika i przypisz go do pola 'user' pacjenta
        user = User.objects.create_user(**user_data)
        validated_data['user'] = user

        # Stwórz pacjenta
        pacjent = Pacjent.objects.create(**validated_data)

        return pacjent

class LekarzSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lekarz
        fields = '__all__'

class GabinetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gabinet
        fields = '__all__'

class WizytaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wizyta
        fields = '__all__'