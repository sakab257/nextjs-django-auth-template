"""
Authentification JWT personnalisée avec cookies HttpOnly.

Ce module override l'authentification JWT par défaut de djangorestframework-simplejwt
pour lire les tokens depuis des cookies HttpOnly au lieu du header Authorization.

Pourquoi utiliser des cookies HttpOnly ?
- Protection XSS : JavaScript ne peut pas accéder aux cookies HttpOnly
- Envoi automatique : Le navigateur envoie les cookies automatiquement
- Simplicité côté frontend : Pas besoin de gérer le stockage des tokens

Flux d'authentification :
1. Login → Django génère les tokens et les met dans des cookies HttpOnly
2. Requêtes suivantes → Le navigateur envoie automatiquement les cookies
3. Cette classe extrait et valide le token depuis le cookie
4. Si valide → request.user est rempli avec l'utilisateur
"""

from django.conf import settings
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class CookieJWTAuthentication(JWTAuthentication):
    """
    Classe d'authentification JWT qui lit le token depuis un cookie HttpOnly.
    
    Hérite de JWTAuthentication qui fournit :
    - get_validated_token() : Décode et valide le JWT
    - get_user() : Récupère l'utilisateur depuis le token
    
    On override uniquement authenticate() pour changer la source du token.
    
    Usage dans settings.py :
        REST_FRAMEWORK = {
            'DEFAULT_AUTHENTICATION_CLASSES': [
                'users.authentication.CookieJWTAuthentication',
            ],
        }
    """
    
    def authenticate(self, request):
        """
        Authentifie la requête en lisant le JWT depuis le cookie.
        
        Cette méthode est appelée automatiquement par DRF pour chaque requête
        sur les vues qui nécessitent une authentification.
        
        Args:
            request: L'objet HttpRequest de Django
            
        Returns:
            tuple: (user, token) si authentifié
            None: Si pas de token (utilisateur anonyme)
            
        Raises:
            InvalidToken: Si le token est présent mais invalide/expiré
        """
        # Récupérer le nom du cookie depuis les settings
        # Permet de changer le nom sans modifier ce code
        cookie_name = settings.SIMPLE_JWT.get('AUTH_COOKIE', 'access_token')
        
        # Extraire le token du cookie
        access_token = request.COOKIES.get(cookie_name)
        
        # Pas de cookie = utilisateur anonyme (pas d'erreur)
        # La permission_class de la vue décidera si c'est autorisé
        if access_token is None:
            return None
        
        # Valider le token et récupérer l'utilisateur
        try:
            # Valide la signature, l'expiration, etc.
            validated_token = self.get_validated_token(access_token)
            
            # Récupère l'utilisateur depuis la base de données
            user = self.get_user(validated_token)
            
            # Retourne le tuple (user, token)
            # DRF assignera automatiquement : request.user = user
            return user, validated_token
            
        except TokenError as e:
            # Token malformé, expiré, signature invalide, etc.
            raise InvalidToken(
                detail={
                    'message': 'Token invalide ou expiré',
                    'error': str(e)
                }
            )
