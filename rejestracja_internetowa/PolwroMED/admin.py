from django.contrib import admin
from .models import Pacjent, Lekarz, Wizyta, Gabinet

admin.site.register(Pacjent)
admin.site.register(Lekarz)
admin.site.register(Wizyta)
admin.site.register(Gabinet)


