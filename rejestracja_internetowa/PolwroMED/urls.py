from django.urls import path
from .views import PacjentListCreateView, PacjentDetailView, LekarzListCreateView, LekarzDetailView, WizytaListCreateView, \
                   WizytaDetailView, GabinetListCreateView, GabinetDetailView, RejestracjaView

urlpatterns = [

# Trasy dla Pacjenta
    path('api/pacjenci/', PacjentListCreateView.as_view(), name='pacjent-list-create'),
    path('api/pacjenci/<int:pk>/', PacjentDetailView.as_view(), name='pacjent-detail'),

    # Trasy dla Lekarza
    path('api/lekarze/', LekarzListCreateView.as_view(), name='lekarz-list-create'),
    path('api/lekarze/<int:pk>/', LekarzDetailView.as_view(), name='lekarz-detail'),

    # Trasy dla Gabinetu
    path('api/gabinety/', GabinetListCreateView.as_view(), name='gabinet-list-create'),
    path('api/gabinety/<int:pk>/', GabinetDetailView.as_view(), name='gabinet-detail'),

    # Trasy dla Wizyty
    path('api/wizyty/', WizytaListCreateView.as_view(), name='wizyta-list-create'),
    path('api/wizyty/<int:pk>/', WizytaDetailView.as_view(), name='wizyta-detail'),

    path('api/rejestracja/', RejestracjaView.as_view(), name='rejestracja'),

]