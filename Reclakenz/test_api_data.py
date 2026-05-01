#!/usr/bin/env python
"""
Script de test pour vérifier la récupération des données de réclamations
"""

import os
import sys
import django
import requests
import json

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Reclakenz.settings')
django.setup()

from apprecla.models import User, Reclamation, ReclamationArticle, Photo

def test_api_data():
    """Test de récupération des données via API"""
    
    print("🧪 Test de récupération des données via API...")
    
    # URL de l'API
    base_url = "http://localhost:8000"
    
    # Créer un utilisateur de test si nécessaire
    user, created = User.objects.get_or_create(
        username='test_api_user',
        defaults={
            'email': 'test_api@example.com',
            'password': 'testpass123'
        }
    )
    
    if created:
        user.set_password('testpass123')
        user.save()
        print("✅ Utilisateur de test créé")
    else:
        print("ℹ️ Utilisateur de test existe déjà")
    
    # Obtenir un token d'authentification
    login_data = {
        'username': 'test_api_user',
        'password': 'testpass123'
    }
    
    try:
        # Login pour obtenir le token
        login_response = requests.post(f"{base_url}/api/token/", data=login_data)
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            access_token = token_data.get('access')
            
            print(f"✅ Token obtenu: {access_token[:20]}...")
            
            # Headers pour les requêtes authentifiées
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            # Récupérer les réclamations
            reclamations_response = requests.get(f"{base_url}/api/reclamations/", headers=headers)
            
            if reclamations_response.status_code == 200:
                reclamations_data = reclamations_response.json()
                print(f"✅ {len(reclamations_data)} réclamations récupérées")
                
                # Afficher les détails de chaque réclamation
                for i, reclamation in enumerate(reclamations_data):
                    print(f"\n📋 Réclamation {i+1}:")
                    print(f"  ID: {reclamation.get('id')}")
                    print(f"  Titre: {reclamation.get('titre')}")
                    print(f"  Statut: {reclamation.get('statut')}")
                    print(f"  Articles: {len(reclamation.get('articles', []))}")
                    print(f"  Photos: {len(reclamation.get('photos', []))}")
                    
                    # Détails des articles
                    if reclamation.get('articles'):
                        print("  📦 Articles:")
                        for article in reclamation['articles']:
                            print(f"    - {article.get('article', {}).get('nom', 'N/A')}")
                            print(f"      Variante: {article.get('variant', {}).get('weight', 'N/A')}")
                            print(f"      Quantité: {article.get('quantite', 'N/A')}")
                            print(f"      Image URL: {article.get('article_image_url', 'N/A')}")
                    
                    # Détails des photos
                    if reclamation.get('photos'):
                        print("  📸 Photos:")
                        for photo in reclamation['photos']:
                            print(f"    - {photo.get('nom_fichier', 'N/A')}")
                            print(f"      URL: {photo.get('piece_jointe', 'N/A')}")
                            print(f"      Description: {photo.get('description', 'N/A')}")
                
                # Test de récupération d'une réclamation spécifique
                if reclamations_data:
                    first_reclamation = reclamations_data[0]
                    reclamation_id = first_reclamation['id']
                    
                    detail_response = requests.get(f"{base_url}/api/reclamations/{reclamation_id}/", headers=headers)
                    
                    if detail_response.status_code == 200:
                        detail_data = detail_response.json()
                        print(f"\n🔍 Détails de la réclamation {reclamation_id}:")
                        print(f"  Articles: {len(detail_data.get('articles', []))}")
                        print(f"  Photos: {len(detail_data.get('photos', []))}")
                        
                        # Vérifier la structure des données
                        if detail_data.get('articles'):
                            print("  ✅ Articles présents dans la réponse")
                            for article in detail_data['articles']:
                                if 'article' in article and 'nom' in article['article']:
                                    print(f"    ✅ Article: {article['article']['nom']}")
                                else:
                                    print(f"    ❌ Article mal formaté: {article}")
                        else:
                            print("  ⚠️ Aucun article dans la réponse")
                        
                        if detail_data.get('photos'):
                            print("  ✅ Photos présentes dans la réponse")
                            for photo in detail_data['photos']:
                                if 'piece_jointe' in photo:
                                    print(f"    ✅ Photo: {photo['piece_jointe']}")
                                else:
                                    print(f"    ❌ Photo mal formatée: {photo}")
                        else:
                            print("  ⚠️ Aucune photo dans la réponse")
                    else:
                        print(f"❌ Erreur lors de la récupération des détails: {detail_response.status_code}")
                        print(detail_response.text)
            else:
                print(f"❌ Erreur lors de la récupération des réclamations: {reclamations_response.status_code}")
                print(reclamations_response.text)
        else:
            print(f"❌ Erreur lors de la connexion: {login_response.status_code}")
            print(login_response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur Django")
        print("Assurez-vous que le serveur Django est démarré: python manage.py runserver")
    except Exception as e:
        print(f"❌ Erreur: {e}")

def test_database_data():
    """Test des données directement en base"""
    
    print("\n🗄️ Test des données directement en base...")
    
    # Compter les réclamations
    reclamations_count = Reclamation.objects.count()
    print(f"📊 Total réclamations en base: {reclamations_count}")
    
    # Compter les articles de réclamation
    articles_count = ReclamationArticle.objects.count()
    print(f"📦 Total articles de réclamation en base: {articles_count}")
    
    # Compter les photos
    photos_count = Photo.objects.count()
    print(f"📸 Total photos en base: {photos_count}")
    
    # Afficher quelques exemples
    if reclamations_count > 0:
        print("\n📋 Exemples de réclamations:")
        for reclamation in Reclamation.objects.all()[:3]:
            print(f"  - ID {reclamation.id}: {reclamation.titre}")
            
            # Articles associés
            articles = ReclamationArticle.objects.filter(reclamation=reclamation)
            print(f"    Articles: {articles.count()}")
            for article in articles:
                print(f"      * {article.article.nom} - Qté: {article.quantite}")
                if article.article_image_url:
                    print(f"        Image: {article.article_image_url}")
            
            # Photos associées
            photos = Photo.objects.filter(reclamation=reclamation)
            print(f"    Photos: {photos.count()}")
            for photo in photos:
                print(f"      * {photo.nom_fichier}")

if __name__ == '__main__':
    try:
        print("🚀 Démarrage des tests de données...")
        
        # Test des données en base
        test_database_data()
        
        # Test de l'API
        test_api_data()
        
        print("\n✅ Tests terminés!")
        
    except Exception as e:
        print(f"❌ Erreur lors des tests: {e}")
        import traceback
        traceback.print_exc()

