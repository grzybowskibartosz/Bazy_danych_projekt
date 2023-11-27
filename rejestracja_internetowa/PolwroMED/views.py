from django.shortcuts import render
from django.http import JsonResponse
from .models import Pacjent, Lekarz, Wizyta, Gabinet
from django.db import models

class Pacjent(models.Model):
    imie = models.CharField(max_length=50)
    nazwisko = models.CharField(max_length=50)
    # Dodaj inne pola modelu Pacjent


