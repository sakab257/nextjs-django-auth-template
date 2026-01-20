"""
Django settings for core project.

Configuration pour une API REST avec authentification JWT via cookies HttpOnly.

Documentation :
- Django : https://docs.djangoproject.com/en/5.0/ref/settings/
- DRF : https://www.django-rest-framework.org/api-guide/settings/
- SimpleJWT : https://django-rest-framework-simplejwt.readthedocs.io/
"""

import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


# =============================================================================
# SÉCURITÉ
# =============================================================================

SECRET_KEY = os.getenv('SECRET_KEY')
DEBUG = os.getenv('DEBUG', 'False') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')


# =============================================================================
# APPLICATIONS
# =============================================================================

INSTALLED_APPS = [
    # Django core
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party
    'rest_framework',                           # Django REST Framework
    'rest_framework_simplejwt',                 # JWT Authentication
    'rest_framework_simplejwt.token_blacklist', # Pour invalider les tokens au logout
    'corsheaders',                              # Gestion CORS pour le frontend
    
    # Local apps
    'users',
    # Ajouter vos autres apps ici
]


# =============================================================================
# MIDDLEWARE
# =============================================================================

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # DOIT être en premier
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# =============================================================================
# CORS - Cross-Origin Resource Sharing
# =============================================================================
# Configuration pour autoriser le frontend à communiquer avec l'API

# Origines autorisées (ajouter l'URL de votre frontend en production)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",      # Next.js dev
    "http://127.0.0.1:3000",
    # "https://votre-frontend.com",  # Production
]

# Autoriser l'envoi des cookies dans les requêtes cross-origin
CORS_ALLOW_CREDENTIALS = True

# Headers autorisés
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]


# =============================================================================
# REST FRAMEWORK
# =============================================================================

REST_FRAMEWORK = {
    # Authentification par défaut via notre classe custom
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'users.authentication.CookieJWTAuthentication',
    ],
    
    # Par défaut, les endpoints nécessitent d'être authentifié
    # Override avec permission_classes = [AllowAny] sur les vues publiques
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    
    # Format de date/heure
    'DATETIME_FORMAT': '%Y-%m-%dT%H:%M:%S%z',
    
    # Pagination par défaut (optionnel, peut être commenté)
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}


# =============================================================================
# SIMPLE JWT
# =============================================================================

SIMPLE_JWT = {
    # Durée de vie des tokens
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),   # Court = plus sécurisé
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),      # Long = meilleure UX
    
    # Rotation des refresh tokens
    # À chaque refresh, un nouveau refresh token est généré
    # L'ancien est invalidé → limite les dégâts si un token est volé
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    
    # Algorithme de signature
    'ALGORITHM': 'HS256',         # Symétrique, utilise SECRET_KEY
    'SIGNING_KEY': SECRET_KEY,
    
    # Claims dans le token
    'USER_ID_FIELD': 'id',        # Champ du model User
    'USER_ID_CLAIM': 'user_id',   # Nom dans la donnée du JWT
    
    # Configuration des cookies (pour notre classe custom)
    'AUTH_COOKIE': 'access_token',
    'AUTH_COOKIE_REFRESH': 'refresh_token',
    'AUTH_COOKIE_SECURE': not DEBUG,    # True en prod (HTTPS only)
    'AUTH_COOKIE_HTTP_ONLY': True,      # Inaccessible via JavaScript
    'AUTH_COOKIE_SAMESITE': 'Lax',      # Protection CSRF
    'AUTH_COOKIE_PATH': '/',
}


# =============================================================================
# DATABASE
# =============================================================================

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}


# =============================================================================
# AUTHENTIFICATION
# =============================================================================

AUTH_USER_MODEL = 'users.User'

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]


# =============================================================================
# INTERNATIONALISATION
# =============================================================================

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Europe/Paris'
USE_I18N = True
USE_TZ = True


# =============================================================================
# FICHIERS STATIQUES
# =============================================================================

STATIC_URL = 'static/'
# STATIC_ROOT = BASE_DIR / 'staticfiles'  # Pour collectstatic en production


# =============================================================================
# AUTRES
# =============================================================================

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
