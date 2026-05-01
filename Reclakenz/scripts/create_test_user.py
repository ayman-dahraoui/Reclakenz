#!/usr/bin/env python
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Reclakenz.settings')
django.setup()

from django.contrib.auth.models import User
from apprecla.models import UserProfile, SimpleRequest

def create_test_user():
    # Créer un utilisateur de test
    username = 'testuser'
    email = 'test@example.com'
    password = 'testpass123'
    
    # Supprimer l'utilisateur s'il existe déjà
    User.objects.filter(username=username).delete()
    
    # Créer l'utilisateur
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password,
        is_active=True
    )
    
    # Créer le profil
    profile = UserProfile.objects.create(
        user=user,
        phone='1234567890',
        user_type='commercial',
        est_membre='yes',
        preuve_justification='Test justification',
        approval_status='approved'
    )
    
    # Créer une demande commerciale approuvée
    simple_request = SimpleRequest.objects.create(
        user=user,
        type_demande='commercial',
        est_membre='yes',
        preuve_justification='Test justification for commercial request',
        status='approved'
    )
    
    print(f"✅ Utilisateur de test créé :")
    print(f"   Username: {username}")
    print(f"   Password: {password}")
    print(f"   Email: {email}")
    print(f"   Profil approuvé: {profile.approval_status}")
    print(f"   Demande commerciale approuvée: {simple_request.status}")
    print(f"\n🔑 Pour obtenir un token JWT :")
    print(f"   POST /api/token/")
    print(f"   {{'username': '{username}', 'password': '{password}'}}")
    print(f"\n📋 Pour tester l'endpoint :")
    print(f"   GET /api/all-reclamations/")
    print(f"   Authorization: Bearer <token_jwt>")

if __name__ == '__main__':
    create_test_user() 