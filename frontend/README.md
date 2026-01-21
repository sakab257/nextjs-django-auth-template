# Next.js - JWT Authentication Template

Template d'authentification Next.js avec JWT stockés dans des cookies HttpOnly, conçu pour fonctionner avec le backend Django REST Framework.

## 🔐 Fonctionnalités

- **Authentification JWT** via cookies HttpOnly (protection XSS)
- **Axios** configuré avec `withCredentials` pour l'envoi automatique des cookies
- **AuthContext** pour gérer l'état de l'utilisateur globalement
- **Middleware** pour protéger les routes
- **Pages** : inscription, connexion, dashboard
- **TypeScript** pour la sécurité du typage

## 📁 Structure

```
├── app/
│   ├── page.tsx                    # Page d'accueil publique
│   ├── layout.tsx                  # Layout global
│   ├── (auth)/
│   │   ├── signin/page.tsx         # Page de connexion
│   │   └── signup/page.tsx         # Page d'inscription
│   └── (protected)/
│       ├── layout.tsx              # Layout avec AuthProvider
│       └── dashboard/page.tsx      # Dashboard protégé
├── contexts/
│   └── AuthContext.tsx             # Context pour l'état utilisateur
├── lib/
│   ├── auth.ts                     # Fonctions d'authentification
│   └── axios.ts                    # Instance Axios configurée
├── proxy.ts                        # Protection des routes
├── .env.local                      # Variables d'environnement
└── package.json
```

## 🚀 Installation

### 1. Cloner et installer les dépendances

```bash
git clone https://github.com/sakab257/nextjs-django-auth-template
cd frontend
pnpm install
# ou npm install / yarn install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Lancer le serveur de développement

```bash
pnpm dev
# ou npm run dev / yarn dev
```

Le site sera accessible sur `http://localhost:3000`

## 📡 Fonctions disponibles

### `lib/auth.ts`

| Fonction | Description | Paramètres |
|----------|-------------|------------|
| `signIn(data)` | Connexion | `SignInData` |
| `signUp(data)` | Inscription | `SignUpData` |
| `signOut()` | Déconnexion | - |
| `getMe()` | Récupérer l'utilisateur connecté | - |
| `refresh()` | Renouveler le token | - |

### `AuthContext`

| Élément | Type | Description |
|---------|------|-------------|
| `user` | `User \| null` | Utilisateur connecté |
| `loading` | `boolean` | Chargement en cours |
| `refresh()` | `() => Promise<void>` | Recharger l'utilisateur |
| `logout()` | `() => Promise<void>` | Déconnexion |

## 📝 Exemples d'utilisation

### Connexion

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";

export default function SignInPage() {
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      await signIn({
                username: formData.get("username") as string,
                password: formData.get("password") as string
            }
        );
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input name="username" placeholder="Nom d'utilisateur" required />
      <input name="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
    </form>
  );
}
```

### Utiliser le Context

```typescript
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/signin");
  }

  if (loading) return <p>Chargement...</p>;
  if (!user) return null;

  return (
    <div>
      <h1>Bonjour {user.first_name} {user.last_name}</h1>
      <p>Email : {user.email}</p>
      <button onClick={handleLogout}>Déconnexion</button>
    </div>
  );
}
```

### Appel API protégé

```typescript
import api from "@/lib/axios";

// Les cookies sont envoyés automatiquement
const response = await api.get("/autre-endpoint/");
```

## 🛡️ Proxy/Middleware

Le proxy/middleware protège automatiquement les routes. Configuration dans `proxy.ts` :

```typescript
// Pages accessibles sans connexion
const publicPages = ["/", "/signin", "/signup"];
```

**Comportement :**
- Page publique → accès libre
- Page protégée sans token → redirection vers `/signin`
- Utilisateur connecté sur `/signin` ou `/signup` → redirection vers `/dashboard`

## 🔧 Configuration Backend

Ce template est conçu pour fonctionner avec le backend Django REST Framework JWT.

**Prérequis côté Django :**
- CORS configuré avec `CORS_ALLOW_CREDENTIALS = True`
- Origine `http://localhost:3000` autorisée
- Cookies `access_token` et `refresh_token` en HttpOnly
*Voir les autres prérequis dans le dossier backend*

## 📂 Types TypeScript

```typescript
// lib/types.ts
interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

// lib/auth.ts
interface SignUpData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password2: string;
}

interface SignInData {
    username: string;
    password: string;
}
```

## 🔒 Sécurité

- **Cookies HttpOnly** : Les tokens ne sont pas accessibles via JavaScript
- **withCredentials** : Axios envoie automatiquement les cookies
- **Middleware** : Protection des routes côté serveur
- **Pas de stockage localStorage** : Les tokens ne sont jamais exposés au JavaScript

## 📦 Dépendances

```json
{
    "axios": "^1.13.2",
    "next": "16.1.4",
    "react": "19.2.3",
    "react-dom": "19.2.3"
}
```

## 🚀 Scripts

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Serveur de développement |
| `pnpm build` | Build de production |
| `pnpm start` | Lancer le build de production |
| `pnpm lint` | Vérifier le code |