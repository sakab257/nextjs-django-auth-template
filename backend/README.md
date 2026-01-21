# Django REST Framework - JWT Authentication Template

Template d'authentification Django REST Framework avec JWT stockés dans des cookies HttpOnly.

## 🔐 Fonctionnalités

- **Authentification JWT** via cookies HttpOnly (protection XSS)
- **Inscription** avec validation du mot de passe
- **Connexion/Déconnexion** avec gestion automatique des cookies
- **Refresh token** avec rotation automatique
- **Blacklist** des tokens révoqués
- **CORS** configuré pour le frontend
- **UUID** comme clé primaire des utilisateurs

## 📁 Structure

```
├── core/
│   ├── settings.py      # Configuration Django + JWT + CORS
│   └── urls.py          # URLs principales
├── users/
│   ├── models.py        # Modèle User custom
│   ├── serializers.py   # Validation des données
│   ├── views.py         # Endpoints d'authentification
│   ├── urls.py          # Routes /api/auth/*
│   └── authentication.py # Classe JWT cookie custom
├── .env.example         # Variables d'environnement
└── requirements.txt     # Dépendances Python
```

## 🚀 Installation

### 1. Cloner et créer l'environnement virtuel

```bash
git clone https://github.com/sakab257/nextjs-django-auth-template
cd backend
python3 -m venv .venv
source .venv/bin/activate  # Linux/Mac
# ou .venv\Scripts\activate  # Windows
```

### 2. Installer les dépendances

```bash
pip install -r requirements.txt
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

### 4. Créer la base de données PostgreSQL

```sql
CREATE DATABASE your_database_name;
CREATE USER your_database_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_database_user;
```

### 5. Faire les migrations nécessaires

```bash
python3 manage.py makemigrations users
python3 manage.py migrate users
python3 manage.py migrate
```

### 6. Créer un superuser (optionnel)

```bash
python3 manage.py createsuperuser
```

### 7. Lancer le serveur

```bash
python3 manage.py runserver
```

## 📡 Endpoints

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| POST | `/api/auth/signup/` | Inscription | Non |
| POST | `/api/auth/signin/` | Connexion | Non |
| POST | `/api/auth/signout/` | Déconnexion | Oui |
| POST | `/api/auth/refresh/` | Renouveler le token | Non |
| GET | `/api/auth/me/` | Utilisateur connecté | Oui |

## 📝 Exemples de requêtes

### Inscription

```bash
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "boussa",
    "first_name": "Salim",
    "last_name": "Bouskine",
    "email": "Salim@example.com",
    "password": "MotDePasse123!",
    "password2": "MotDePasse123!"
  }'
```

### Connexion

```bash
curl -X POST http://localhost:8000/api/auth/signin/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "boussa",
    "password": "MotDePasse123!"
  }' \
  -c cookies.txt
```

### Accéder à une route protégée

```bash
curl http://localhost:8000/api/auth/me/ -b cookies.txt
```

### Déconnexion

```bash
curl -X POST http://localhost:8000/api/auth/signout/ -b cookies.txt
```

## 🔧 Configuration Frontend (Next.js)

Pour que le frontend puisse envoyer/recevoir les cookies :

```typescript
try {
      const response = await api.post("/auth/signin/", data);
      return response.data;
  } catch (error) {
      if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.error || "Identifiants incorrects");
      }
      throw new Error("Erreur de connexion");
  }
```

## 🔒 Sécurité

- **HttpOnly cookies** : Les tokens ne sont pas accessibles via JavaScript
- **Secure flag** : Cookies envoyés uniquement en HTTPS (en production)
- **SameSite=Lax** : Protection CSRF basique
- **Token rotation** : Nouveau refresh token à chaque utilisation
- **Blacklist** : Les tokens révoqués sont invalidés

## 📦 Dépendances

- Django
- djangorestframework
- djangorestframework-simplejwt
- django-cors-headers
- psycopg2-binary
- python-dotenv
