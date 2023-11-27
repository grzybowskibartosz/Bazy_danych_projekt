from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Pacjent, Lekarz, Wizyta, Gabinet
from django.contrib import messages
from .forms import RegistrationForm
def registration(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request,f'Konto {username} zostało utworzone! Możesz się zalogować')

        else:
            form = RegistrationForm()

        return render(request,'registration/registration.html', {'form': form})


