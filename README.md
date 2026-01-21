# 🔐 Full-Stack JWT Authentication Template

Template d'authentification full-stack avec **Django REST Framework** (backend) et **Next.js** (frontend), utilisant des JWT stockés dans des cookies HttpOnly.

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|----------------|-------------|
| 🔒 **JWT HttpOnly** | Tokens stockés dans des cookies sécurisés, inaccessibles via JavaScript |
| 🔄 **Refresh Token** | Rotation automatique des tokens pour une sécurité renforcée |
| 🚫 **Blacklist** | Révocation des tokens à la déconnexion |
| 🌐 **CORS** | Configuration prête pour la communication frontend/backend |
| 🛡️ **Middleware** | Protection des routes côté Next.js |
| 📝 **TypeScript** | Typage complet côté frontend |
| 🆔 **UUID** | Identifiants utilisateurs sécurisés |

## 📁 Structure du projet

```
project/
├── backend/                    # Django REST Framework
│   ├── core/
│   │   ├── settings.py         # Configuration Django + JWT + CORS
│   │   └── urls.py
│   ├── users/
│   │   ├── models.py           # Modèle User custom
│   │   ├── serializers.py      # Validation des données
│   │   ├── views.py            # Endpoints d'authentification
│   │   ├── urls.py             # Routes /api/auth/*
│   │   └── authentication.py   # Classe JWT cookie custom
│   ├── .env.example
│   ├── requirements.txt
│   ├── manage.py
│   └── README.md
│
├── frontend/                   # Next.js
│   ├── app/
│   │   ├── page.tsx            # Page d'accueil
│   │   ├── (auth)/
│   │   │   ├── signin/page.tsx
│   │   │   └── signup/page.tsx
│   │   └── (protected)/
│   │       ├── layout.tsx      # AuthProvider
│   │       └── dashboard/page.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── auth.ts             # Fonctions d'authentification
│   │   ├── axios.ts            # Instance Axios configurée
|   |   ├── fonts.ts            # Pour toutes les fonts 
|   |   └── types.ts            # Pour tous les types qui seront utilisés ensuite           
│   ├── proxy.ts                # Protection des routes
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── README.md                   # Ce fichier
```

## 🚀 Installation rapide

### Prérequis

- Python 3.10+
- Node.js 18+
- PostgreSQL
- pnpm (ou npm/yarn)

### 1. Cloner le projet

```bash
git clone https://github.com/sakab257/nextjs-django-auth-template
cd nextjs-django-auth-template
```
*Vous pouvez évidemment renommer le dossier comme il vous semble*

### 2. Backend (Django)

```bash
cd backend

# Environnement virtuel
python3 -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Dépendances
pip install -r requirements.txt

# Configuration
cp .env.example .env
# Éditer .env avec vos valeurs

# Base de données
python3 manage.py makemigrations users
python3 manage.py migrate

# Lancer le serveur
python3 manage.py runserver
```

Le backend sera accessible sur `http://localhost:8000`

- [README Backend](./backend/README.md) - Documentation détaillée du backend

### 3. Frontend (Next.js)

```bash
cd frontend

# Dépendances
pnpm install

# Configuration
cp .env.example .env.local
# Éditer .env.local avec vos valeurs

# Lancer le serveur
pnpm dev
```

Le frontend sera accessible sur `http://localhost:3000`

## 📡 Endpoints API

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/signup/` | Inscription | ❌ |
| POST | `/api/auth/signin/` | Connexion | ❌ |
| POST | `/api/auth/signout/` | Déconnexion | ✅ |
| POST | `/api/auth/refresh/` | Renouveler le token | ❌ |
| GET | `/api/auth/me/` | Utilisateur connecté | ✅ |

## 🔄 Flux d'authentification

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           INSCRIPTION                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  1. User remplit le formulaire sur /signup                              │
│  2. Frontend → POST /api/auth/signup/ → Backend                         │
│  3. Backend crée le user + génère les tokens                            │
│  4. Backend renvoie les cookies (access_token + refresh_token)          │
│  5. Frontend redirige vers /dashboard                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           CONNEXION                                      │
├─────────────────────────────────────────────────────────────────────────┤
│  1. User remplit le formulaire sur /signin                              │
│  2. Frontend → POST /api/auth/signin/ → Backend                         │
│  3. Backend vérifie les credentials + génère les tokens                 │
│  4. Backend renvoie les cookies (access_token + refresh_token)          │
│  5. Frontend redirige vers /dashboard                                   │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        REQUÊTE AUTHENTIFIÉE                             │
├─────────────────────────────────────────────────────────────────────────┤
│  1. User accède à /dashboard                                            │
│  2. Middleware vérifie la présence du cookie access_token               │
│  3. AuthContext appelle GET /api/auth/me/                               │
│  4. Le navigateur envoie automatiquement les cookies                    │
│  5. Backend valide le JWT et renvoie les infos user                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                           DÉCONNEXION                                    │
├─────────────────────────────────────────────────────────────────────────┤
│  1. User clique sur "Déconnexion"                                       │
│  2. Frontend → POST /api/auth/signout/ → Backend                        │
│  3. Backend blacklist le refresh_token + supprime les cookies           │
│  4. Frontend redirige vers /signin                                      │
└─────────────────────────────────────────────────────────────────────────┘
```

## ⚙️ Configuration

### Backend `.env`

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=nom_db
DB_USER=user_db
DB_PASSWORD=mdp_db
DB_HOST=localhost
DB_PORT=5432
```

### Frontend `.env`

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

- [README Frontend](./frontend/README.md) - Documentation détaillée du frontend

## 🔒 Sécurité

| Mesure | Description |
|--------|-------------|
| **HttpOnly** | Les cookies ne sont pas accessibles via JavaScript (protection XSS) |
| **Secure** | Cookies envoyés uniquement en HTTPS (en production) |
| **SameSite=Lax** | Protection CSRF basique |
| **Token Rotation** | Nouveau refresh token à chaque utilisation |
| **Blacklist** | Les tokens révoqués sont invalidés en base |
| **UUID** | Identifiants non prédictibles |
| **Validation** | Mots de passe validés par Django |

## 🧪 Tester l'authentification

### Avec cURL

```bash
# Inscription
curl -X POST http://localhost:8000/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{"username":"john","first_name":"John","last_name":"Doe","email":"john@example.com","password":"SecurePass123!","password2":"SecurePass123!"}' \
  -c cookies.txt

# Connexion
curl -X POST http://localhost:8000/api/auth/signin/ \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"SecurePass123!"}' \
  -c cookies.txt

# Accéder à une route protégée
curl http://localhost:8000/api/auth/me/ -b cookies.txt

# Déconnexion
curl -X POST http://localhost:8000/api/auth/signout/ -b cookies.txt
```

### Avec le navigateur

1. Aller sur `http://localhost:3000/signup`
2. Créer un compte
3. Vous êtes automatiquement redirigé vers `/dashboard`
4. Cliquer sur "Déconnexion"
5. Vous êtes redirigé vers `/signin`

## 📦 Technologies

### Backend

- Django
- Django REST Framework
- djangorestframework-simplejwt
- django-cors-headers
- PostgreSQL
- python-dotenv

### Frontend

- Next.js 16^
- React 19^
- TypeScript
- Axios 1.13^

## 📚 Documentation

- [README Backend](./backend/README.md) - Documentation détaillée du backend
- [README Frontend](./frontend/README.md) - Documentation détaillée du frontend