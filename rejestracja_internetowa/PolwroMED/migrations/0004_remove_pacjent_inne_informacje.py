# Generated by Django 4.2.7 on 2023-11-30 17:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('PolwroMED', '0003_remove_wizyta_czas_wizyty_remove_wizyta_data_wizyty_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pacjent',
            name='inne_informacje',
        ),
    ]
