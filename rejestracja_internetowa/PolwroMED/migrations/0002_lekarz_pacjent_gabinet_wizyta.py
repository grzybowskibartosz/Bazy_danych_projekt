# Generated by Django 4.2.7 on 2023-11-25 20:26

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Lekarz',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('imie', models.CharField(max_length=50)),
                ('nazwisko', models.CharField(max_length=50)),
                ('specjalizacja', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Pacjent',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('imie', models.CharField(max_length=50)),
                ('nazwisko', models.CharField(max_length=50)),
                ('pesel', models.CharField(max_length=11, unique=True)),
                ('data_urodzenia', models.DateField()),
                ('adres', models.TextField(max_length=256)),
                ('inne_informacje', models.TextField(max_length=3000)),
            ],
        ),
        migrations.CreateModel(
            name='Wizyta',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('data_i_godzina', models.DateTimeField(default=django.utils.timezone.now)),
                ('czas_wizyty', models.CharField(max_length=5)),
                ('data_wizyty', models.DateField()),
                ('opis', models.TextField()),
                ('status', models.CharField(choices=[('Zaplanowana', 'Zaplanowana'), ('odbyta', 'Odbyta'), ('anulowana', 'Anulowana')], max_length=20)),
                ('diagnoza', models.TextField()),
                ('przepisane_leki', models.TextField()),
                ('notatki_lekarza', models.TextField()),
                ('lekarz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='PolwroMED.lekarz')),
                ('pacjent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='PolwroMED.pacjent')),
            ],
        ),
        migrations.CreateModel(
            name='Gabinet',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('numer_gabinetu', models.CharField(max_length=10)),
                ('specjalizacja', models.CharField(max_length=100)),
                ('opis_gabinetu', models.TextField(blank=True, null=True)),
                ('status_dostepnosci', models.BooleanField(default=True)),
                ('lekarz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='PolwroMED.lekarz')),
            ],
        ),
    ]
