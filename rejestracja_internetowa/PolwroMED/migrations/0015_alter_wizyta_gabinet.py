# Generated by Django 4.2.7 on 2024-01-14 12:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('PolwroMED', '0014_lekarz_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wizyta',
            name='gabinet',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='PolwroMED.gabinet'),
        ),
    ]