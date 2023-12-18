# serializers.py
from rest_framework import serializers
from .models import Pacjent, Lekarz, Gabinet, Wizyta

class PacjentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pacjent
        fields = '__all__'

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