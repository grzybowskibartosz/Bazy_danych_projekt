from django.urls import path
from .views import PacjentListCreateView, PacjentDetailView, LekarzListCreateView, LekarzDetailView, WizytaListCreateView,      \
                   WizytaDetailView, GabinetListCreateView, GabinetDetailView, RejestracjaView, LoginView, UserInfoView,        \
                   moje_wizyty, wizyty_lekarza, wizyty_pacjenta, zmien_status_wizyty, NasiLekarzeView, log_out_view,            \
                   zajete_terminy_na_dzien, RezerwacjaView, dostepne_terminy, GabinetyLekarzaView

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

    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', log_out_view, name='logout'),

    path('api/rezerwacje/', RezerwacjaView.as_view(), name='rezerwacje'),

    path('api/get_user_info/', UserInfoView.as_view(), name='get_user_info'),

    path('api/moje-wizyty/', moje_wizyty, name='moje_wizyty'),

    path('api/wizyty/<int:lekarz_id>/lekarz/', wizyty_lekarza, name='wizyty_lekarza'),

    path('api/dostepne-terminy/<int:lekarz_id>/', dostepne_terminy, name='dostepne-terminy'),
    path('api/dostepne-terminy/<int:lekarzId>/', dostepne_terminy, name='dostepne-terminy'),

    path('api/lekarze/<int:lekarz_id>/gabinety/', GabinetyLekarzaView.as_view(), name='gabinety-lekarza'),

    path('api/wizyty/<int:pacjent_id>/pacjent/', wizyty_pacjenta, name='wizyty_pacjenta'),

    path('api/wizyty/<int:wizyta_id>/zmien_status/', zmien_status_wizyty, name='zmien_status_wizyty'),

    path('api/nasi-lekarze/', NasiLekarzeView.as_view(), name='nasi-lekarze'),

    path('api/zajete-terminy-nowy/<int:lekarz_id>/<int:rok>/<int:miesiac>/<int:dzien>/',
         zajete_terminy_na_dzien, name='zajete-terminy-nowy'),
]