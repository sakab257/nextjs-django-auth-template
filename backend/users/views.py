"""
Views d'authentification JWT avec cookies HttpOnly.

Ce module implémente les endpoints d'authentification :
- POST /signup/  → Créer un compte
- POST /signin/  → Se connecter (reçoit les cookies)
- POST /signout/ → Se déconnecter (supprime les cookies)
- POST /refresh/ → Renouveler l'access token
- GET  /me/      → Récupérer l'utilisateur connecté

Flux d'authentification :
1. L'utilisateur s'inscrit via /signup/
2. L'utilisateur se connecte via /signin/ → reçoit les cookies
3. Les requêtes suivantes envoient automatiquement les cookies
4. Quand l'access token expire, /refresh/ en génère un nouveau
5. L'utilisateur se déconnecte via /signout/ → cookies supprimés
"""

from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import SignInSerializer, SignUpSerializer, UserSerializer

class SignUpView(APIView):
    """
    Inscription d'un nouvel utilisateur.
    
    POST /api/auth/signup/
    
    Données :
    {
        "username": "boussa",
        "first_name": "Salim",
        "last_name": "Bouskine",
        "email": "salim@example.com",
        "password": "MotDePasse123!",
        "password2": "MotDePasse123!"
    }
    
    Réponses :
    - 201 : Compte créé avec succès
    - 400 : Données invalides (email déjà pris, mot de passe trop faible, etc.)
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data,status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)



class SignInView(APIView):
    """
    Connexion d'un utilisateur.
    
    POST /api/auth/signin/
    
    Payload :
    {
        "username": "boussa",
        "password": "MotDePasse123!"
    }
    
    Réponses :
    - 200 : Connecté (cookies Set-Cookie dans les headers)
    - 400 : Payload invalide
    - 401 : Identifiants incorrects
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = SignInSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            username=serializer.validated_data['username'],
            password=serializer.validated_data['password']
        )

        if user is None:
            return Response(
                {'error': 'Nom d\'utilisateur ou mot de passe incorrect'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Générer les tokens
        refresh = RefreshToken.for_user(user)

        # Préparer la réponse
        response = Response(UserSerializer(user).data)

        # Ajouter les cookies
        response.set_cookie(
            key='access_token',
            value=str(refresh.access_token),
            max_age=60 * 15,  # 15 minutes
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax'
        )
        response.set_cookie(
            key='refresh_token',
            value=str(refresh),
            max_age=60 * 60 * 24 * 7,  # 7 jours
            httponly=True,
            secure=not settings.DEBUG,
            samesite='Lax'
        )

        return response


class SignOutView(APIView):
    """
    Déconnexion de l'utilisateur.
    
    POST /api/auth/signout/
    
    Pas de données nécessaire (le refresh token est lu depuis le cookie).
    
    Réponses :
    - 200 : Déconnecté (cookies supprimés)
    - 401 : Non authentifié
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Blacklister le refresh token pour l'invalider
        refresh_token = request.COOKIES.get('refresh_token')
        
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                # Token déjà invalide, on continue
                pass
        
        # Préparer la réponse et supprimer les cookies
        response = Response({'message': 'Déconnexion réussie'})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        
        return response


class RefreshView(APIView):
    """
    Renouvellement de l'access token.
    
    POST /api/auth/refresh/
    
    Pas de données nécessaire (le refresh token est lu depuis le cookie).
    
    Utilisation :
    Quand l'access token expire (après 15 min), le frontend appelle
    cet endpoint pour obtenir un nouveau access token sans redemander
    le mot de passe.
    
    Réponses :
    - 200 : Token renouvelé (nouveau cookie access_token)
    - 401 : Refresh token invalide ou expiré
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response(
                {'error': 'Refresh token manquant'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            # Valider le refresh token et générer un nouvel access token
            refresh = RefreshToken(refresh_token)
            access = refresh.access_token
            
            response = Response({'message': 'Token renouvelé'})
            
            # Mettre à jour le cookie access_token
            response.set_cookie(
                key='access_token',
                value=str(access),
                max_age=60 * 15,
                httponly=True,
                secure=not settings.DEBUG,
                samesite='Lax',
                path='/',
            )
            
            return response
            
        except TokenError:
            return Response(
                {'error': 'Refresh token invalide ou expiré'},
                status=status.HTTP_401_UNAUTHORIZED
            )


class MeView(APIView):
    """
    Récupération des informations de l'utilisateur connecté.
    
    GET /api/auth/me/
    
    Réponses :
    - 200 : Informations de l'utilisateur
    - 401 : Non authentifié
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # request.user est rempli automatiquement par CookieJWTAuthentication
        return Response({
            'user': UserSerializer(request.user).data
        })
