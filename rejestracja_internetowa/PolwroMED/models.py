from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import MinLengthValidator, MaxLengthValidator, RegexValidator
from datetime import date, timedelta



def validate_birthdate(value):
    if value >= date.today():
        raise ValidationError("Data urodzenia nie może być z przyszłości.")

def validate_age(value):
    today = date.today()
    age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
    if age > 130:
        raise ValidationError("Wiek pacjenta nie może przekraczać 150 lat.")

def validate_pesel(value):
    if not value.isdigit():
        raise ValidationError("PESEL powinien zawierać tylko cyfry.")

class Pacjent(models.Model):
    id = models.AutoField(primary_key=True)
    imie = models.CharField(max_length=50)
    nazwisko = models.CharField(max_length=50)
    pesel = models.CharField(
        max_length=11,
        unique=True,
        validators=[MinLengthValidator(limit_value=11, message='PESEL musi mieć dokładnie 11 cyfr.'),
                    MaxLengthValidator(limit_value=11, message='PESEL musi mieć dokładnie 11 cyfr.'),
                    RegexValidator(regex=r'^\d*$', message='PESEL może zawierać tylko cyfry.'),]
    )
    data_urodzenia = models.DateField(validators=[validate_birthdate, validate_age])
    adres = models.TextField(max_length=256)
    inne_informacje = models.TextField(max_length=3000,blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null = True, default = None)

    def __str__(self):
        return f'{self.imie} {self.nazwisko} {self.pesel} {self.data_urodzenia} {self.adres} ({self.user.username})'

class Lekarz(models.Model):
    id = models.AutoField(primary_key=True)
    imie = models.CharField(max_length=50)
    nazwisko = models.CharField(max_length=50)
    specjalizacja = models.CharField(max_length=50)

    gabinety = models.ManyToManyField('Gabinet', related_name='lekarze_gabinetow')

    def __str__(self):
        return f'{self.imie} {self.nazwisko} - {self.specjalizacja}'

class Gabinet(models.Model):
    id = models.AutoField(primary_key=True)
    #lekarz = models.ForeignKey(Lekarz, on_delete=models.CASCADE, null=True, blank=True)
    numer_gabinetu = models.CharField(max_length=10, unique=True)
    specjalizacja = models.CharField(max_length=100)
    opis_gabinetu = models.TextField(blank=True, null=True)
    status_dostepnosci = models.BooleanField(default=True)

    lekarze = models.ManyToManyField('Lekarz', related_name='gabinety_lekarzy', blank=True)

    def __str__(self):
        return self.numer_gabinetu


class Wizyta(models.Model):
    id = models.AutoField(primary_key=True)
    data_i_godzina = models.DateTimeField(default=timezone.now)
    lekarz = models.ForeignKey(Lekarz, on_delete=models.CASCADE)
    pacjent = models.ForeignKey(Pacjent, on_delete=models.CASCADE)
    opis = models.TextField()
    STATUS_CHOICES = [
        ('Zaplanowana', 'Zaplanowana'),
        ('odbyta', 'Odbyta'),
        ('anulowana', 'Anulowana'),
        # Dodaj inne statusy według potrzeb
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    gabinet = models.ForeignKey(Gabinet, on_delete=models.CASCADE)
    diagnoza = models.TextField(blank=True)
    przepisane_leki = models.TextField(blank=True)
    notatki_lekarza = models.TextField(blank=True)

    def clean(self):
        # Sprawdź, czy lekarz jest dostępny w podanym terminie tylko dla nowych wizyt
        if self._state.adding and self.status == 'Zaplanowana':
            zajete_terminy_lekarza = Wizyta.objects.filter(
                lekarz_id=self.lekarz_id,
                data_i_godzina=self.data_i_godzina,
                status='Zaplanowana'
            )
            if zajete_terminy_lekarza.exists():
                raise ValidationError('Lekarz jest zajęty w podanym terminie.')

        # Sprawdź, czy gabinet jest dostępny w podanym terminie tylko dla nowych wizyt
        if self._state.adding and self.status == 'Zaplanowana':
            zajete_terminy_gabinetu = Wizyta.objects.filter(
                gabinet_id=self.gabinet_id,
                data_i_godzina=self.data_i_godzina,
                status='Zaplanowana'
            )
            if zajete_terminy_gabinetu.exists():
                raise ValidationError('Gabinet jest zajęty w podanym terminie.')

        if self.status == 'Odbyta' and not self.diagnoza:
            raise ValidationError('Pole "Diagnoza" jest wymagane dla wizyty odbytej.')

        if self.status == 'Odbyta' and not self.przepisane_leki:
            raise ValidationError('Pole "Przepisane leki" jest wymagane dla wizyty odbytej.')

        # Ustawianie daty i godziny wizyty tylko w przyszłość
        if self.data_i_godzina and self.data_i_godzina < timezone.now():
            raise ValidationError("Wizyty można umawiać tylko na przyszłość.")

        # Sprawdź, czy nie ma innej wizyty w tym samym gabinecie
        if not self._state.adding:  # Sprawdzenie tylko dla edytowanej wizyty
            kolidujace_wizyty_gabinet = Wizyta.objects.filter(
                gabinet_id=self.gabinet_id,
                data_i_godzina=self.data_i_godzina,
                status='Zaplanowana'
            ).exclude(pk=self.pk)  # Wyklucz obecną wizytę

            if kolidujace_wizyty_gabinet.exists():
                raise ValidationError('Edycja wizyty spowoduje kolizję z inną wizytą w tym samym gabinecie.')

        # Sprawdź, czy nie ma innej wizyty u tego samego lekarza
        if not self._state.adding:  # Sprawdzenie tylko dla edytowanej wizyty
            kolidujace_wizyty_lekarz = Wizyta.objects.filter(
                lekarz_id=self.lekarz_id,
                data_i_godzina=self.data_i_godzina,
                status='Zaplanowana'
            ).exclude(pk=self.pk)  # Wyklucz obecną wizytę

            if kolidujace_wizyty_lekarz.exists():
                raise ValidationError('Edycja wizyty spowoduje kolizję z inną wizytą u tego samego lekarza.')

        # Sprawdź, czy pacjent nie ma już innej zaplanowanej wizyty w tym samym czasie
        if self.status == 'Zaplanowana':
            kolidujace_wizyty_pacjent = Wizyta.objects.filter(
                pacjent_id=self.pacjent_id,
                data_i_godzina=self.data_i_godzina,
                status='Zaplanowana'
            ).exclude(pk=self.pk)  # Wyklucz obecną edytowaną wizytę

            if kolidujace_wizyty_pacjent.exists():
                raise ValidationError('Pacjent ma już zaplanowaną inną wizytę w tym samym czasie.')


    def save(self, *args, **kwargs):
        self.full_clean()  # Wywołanie metody clean przed zapisem
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Wizyta u {self.lekarz} przez {self.pacjent} dnia {self.data_i_godzina} w gabinecie {self.gabinet}'


