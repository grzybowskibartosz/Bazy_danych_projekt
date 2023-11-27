from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


class Pacjent(models.Model):
    id = models.AutoField(primary_key=True)
    imie = models.CharField(max_length=50)
    nazwisko = models.CharField(max_length=50)
    pesel = models.CharField(max_length=11, unique=True)
    data_urodzenia = models.DateField()
    adres = models.TextField(max_length=256)  # Poprawione
    inne_informacje = models.TextField(max_length=3000)

    def __str__(self):
        return f'{self.imie} {self.nazwisko}'

class Lekarz(models.Model):
    id = models.AutoField(primary_key=True)
    imie = models.CharField(max_length=50)
    nazwisko = models.CharField(max_length=50)
    specjalizacja = models.CharField(max_length=50)

    gabinety = models.ManyToManyField('Gabinet', related_name='lekarze_gabinetow')

    def __str__(self):
        return f'{self.imie} {self.nazwisko} - {self.specjalizacja}'

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
    diagnoza = models.TextField(blank=True)
    przepisane_leki = models.TextField(blank=True)
    notatki_lekarza = models.TextField(blank=True)

    def clean(self):
        # Sprawdź, czy lekarz jest dostępny w podanym terminie czy gabinet jest dostepny
        zajete_terminy = Wizyta.objects.filter(
            lekarz=self.lekarz,
            data_i_godzina__date=self.data_i_godzina.date(),
            status='Zaplanowana'
        )
        if zajete_terminy.exists():
            raise ValidationError('Lekarz jest zajęty w podanym terminie.')

       # Sprawdź, czy gabinet jest dostępny w podanym terminie
        zajete_terminy_gabinetu = Wizyta.objects.filter(
            lekarz=self.lekarz,
            data_i_godzina__date=self.data_i_godzina.date(),
            status='Zaplanowana',
            gabinet=self.gabinet
        )

        if self.status == 'Odbyta' and not self.diagnoza:
            raise ValidationError('Pole "Diagnoza" jest wymagane dla wizyty odbytej.')

        if self.status == 'Odbyta' and not self.przepisane_leki:
            raise ValidationError('Pole "Przepisane leki" jest wymagane dla wizyty odbytej.')

    def save(self, *args, **kwargs):
        self.full_clean()  # Wywołanie metody clean przed zapisem
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Wizyta u {self.lekarz} przez {self.pacjent} dnia {self.data_i_godzina}'

class Gabinet(models.Model):
    id = models.AutoField(primary_key=True)
    lekarz = models.ForeignKey(Lekarz, on_delete=models.CASCADE)
    numer_gabinetu = models.CharField(max_length=10, unique=True)
    specjalizacja = models.CharField(max_length=100)
    opis_gabinetu = models.TextField(blank=True, null=True)
    status_dostepnosci = models.BooleanField(default=True)

    lekarze = models.ManyToManyField('Lekarz', related_name='gabinety_lekarzy')

    def __str__(self):
        return self.numer_gabinetu

