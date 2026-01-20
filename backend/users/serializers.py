"""
Serializers pour l'application users.

Les serializers transforment les données entre :
- JSON (API) ↔ Objets Python (Django)

Ils gèrent aussi la validation des données entrantes.
"""

from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer pour afficher les informations d'un utilisateur.
    
    Utilisé pour :
    - Réponse après login/signup
    - Endpoint /me/
    - Affichage des infos utilisateur
    
    Note: Ne jamais inclure le password dans les fields !
    """
    
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')
        read_only_fields = ('id', 'username')


class SignUpSerializer(serializers.ModelSerializer):
    """
    Serializer pour l'inscription d'un nouvel utilisateur.
    
    Exemple de données :
    {
        "username": "boussa",
        "first_name": "Salim",
        "last_name": "Bouskine",
        "email": "salim@example.com",
        "password": "MotDePasse123!",
        "password2": "MotDePasse123!"
    }
    """
    
    password = serializers.CharField(
        write_only=True,  # Jamais renvoyé dans les réponses
        required=True,
        validators=[validate_password],  # Utilise les validateurs Django
        style={'input_type': 'password'},  # Pour l'interface DRF browsable
    )
    
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )
    
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password', 'password2')
    
    def validate_email(self, value):
        """Vérifie que l'email n'est pas déjà utilisé."""
        if User.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Cette adresse email est déjà utilisée.")
        return value.lower()
    
    def validate(self, data):
        """Vérifie que les deux mots de passe correspondent."""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({
                'password2': 'Les mots de passe ne correspondent pas.'
            })
        return data
    
    def create(self, validated_data):
        """
        Pour créer un nouvel utilisateur avec un nom d'utilisateur automatique.
            validated_data.pop('password2')
            # Générer le username à partir du prénom et nom
            first_name = validated_data['first_name'].lower()
            last_name = validated_data['last_name'].lower()
            base_username = f"{last_name[:4]}{first_name[:2]}"
            Exemple : Salim Bouskine -> boussa

            # Gérer les doublons (boussa, boussa1, boussa2...)
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1

            validated_data['username'] = username
            return User.objects.create_user(**validated_data)

        Crée un nouvel utilisateur.
        
        Utilise create_user() qui :
        - Hash le mot de passe automatiquement
        - Normalise l'email
        """
        validated_data.pop('password2')  # On retire password2, pas besoin pour la création
        
        user = User.objects.create_user(**validated_data)
        return user


class SignInSerializer(serializers.Serializer):
    """
    Serializer pour la connexion.
    
    Note: C'est un Serializer simple, pas un ModelSerializer,
    car on ne crée/modifie pas d'objet en base.
    
    Exemple de données :
    {
        "username": "boussa",
        "password": "MotDePasse123!"
    }
    """
    
    username = serializers.CharField(max_length=100,required=True,)
    
    password = serializers.CharField(required=True,write_only=True,style={'input_type': 'password'},)
