from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self):
        return self.title


class Pacjent(models.Model):
    id = models.AutoField(primary_key=True)
    imie = models.CharField(max_length=50)
    nazwisko = models.CharField(max_length=50)
    pesel = models.CharField(max_length=11, unique=True)
    data_urodzenia = models.DateField()

    def __str__(self):
        return f'{self.imie} {self.nazwisko}'

class Lekarz(models.Model):
    id = models.AutoField(primary_key=True)
    imie = models.CharField(max_length=50)
    nazwisko = models.CharField(max_length=50)
    specjalizacja = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.imie} {self.nazwisko} - {self.specjalizacja}'

class Wizyta(models.Model):
    id = models.AutoField(primary_key=True)
    data_i_godzina = models.DateTimeField()
    lekarz = models.ForeignKey(Lekarz, on_delete=models.CASCADE)
    pacjent = models.ForeignKey(Pacjent, on_delete=models.CASCADE)
    opis = models.TextField()

    def __str__(self):
        return f'Wizyta u {self.lekarz} przez {self.pacjent} dnia {self.data_i_godzina}'

class HistoriaLeczenia(models.Model):
    id = models.AutoField(primary_key=True)
    pacjent = models.ForeignKey(Pacjent, on_delete=models.CASCADE)
    lekarz = models.ForeignKey(Lekarz, on_delete=models.CASCADE)
    data_leczenia = models.DateField()
    diagnoza = models.TextField()
    przepisane_leki = models.TextField()
    notatki_lekarza = models.TextField()

    def __str__(self):
        return f'Historia leczenia {self.pacjent} - {self.lekarz} - {self.data_leczenia}'

