"""
Models pour l'application users.

Ce fichier définit le modèle User personnalisé qui étend AbstractUser de Django.
On utilise un UUID comme clé primaire pour plus de sécurité dans les APIs.
"""

import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """
    Modèle User personnalisé.
    
    Étend AbstractUser pour :
    - Utiliser un UUID comme clé primaire (plus sécurisé que les IDs auto-incrémentés)
    - Rendre l'email unique (pour potentiellement l'utiliser comme identifiant)
    
    Attributs hérités de AbstractUser :
    - username, password, email, first_name, last_name
    - is_active, is_staff, is_superuser
    - date_joined, last_login
    """
    
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    
    username = models.CharField(max_length=50,unique=True)
    
    first_name = models.CharField(max_length=255,)
    
    last_name = models.CharField(max_length=255)
    
    email = models.EmailField(max_length=255,unique=True,)
    
    # =========================================================================
    # Configuration de l'authentification
    # =========================================================================
    
    # Champ utilisé pour l'authentification (par défaut: username)
    # Décommenter la ligne suivante pour authentifier par email :
    # USERNAME_FIELD = 'email'
    
    # Champs requis lors de la création d'un superuser (en plus de USERNAME_FIELD et password)
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email']
    
    class Meta:
        verbose_name = "Utilisateur"
        verbose_name_plural = "Utilisateurs"
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.username
    
    def get_full_name(self):
        """Retourne le nom complet de l'utilisateur."""
        return f"{self.first_name} {self.last_name}".strip()
