# serializers.py
from rest_framework import serializers
from .models import Pacjent, Lekarz, Gabinet, Wizyta
from django.contrib.auth import get_user_model

class PacjentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pacjent
        fields = '__all__'

        def create(self, validated_data):
            user_data = validated_data.pop('user')
            user_serializer = UserSerializer(data=user_data)
            if user_serializer.is_valid():
                user = user_serializer.save()
                pacjent = Pacjent.objects.create(user=user, **validated_data)
                return pacjent
            else:
                raise serializers.ValidationError({'user': user_serializer.errors})
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


User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
