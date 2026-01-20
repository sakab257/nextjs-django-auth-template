"""
URL configuration for core project.

Routes principales :
- /admin/     → Interface d'administration Django
- /api/auth/  → Endpoints d'authentification (users app)
- /api/       → Autres endpoints de l'API (à ajouter)
"""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls', namespace='users')),
    # Ajouter vos autres apps ici :
    # path('api/', include('votre_app.urls')),
]
