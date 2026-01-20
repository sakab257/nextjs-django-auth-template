"""
URLs pour l'application users (authentification).

Endpoints disponibles :
- POST /api/auth/signup/  → Inscription
- POST /api/auth/signin/  → Connexion
- POST /api/auth/signout/ → Déconnexion
- POST /api/auth/refresh/ → Renouveler le token
- GET  /api/auth/me/      → Utilisateur connecté
"""

from django.urls import path

from .views import SignInView, SignOutView, MeView, RefreshView, SignUpView

app_name = 'users'

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('signout/', SignOutView.as_view(), name='signout'),
    path('refresh/', RefreshView.as_view(), name='refresh'),
    path('me/', MeView.as_view(), name='me'),
]
