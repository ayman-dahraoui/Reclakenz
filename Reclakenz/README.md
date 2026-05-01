# Reclakenz — Système de Gestion des Réclamations

Reclakenz est une application web full-stack de gestion des réclamations pour trois entreprises : **Vetadis**, **Kenz Maroc** et **KenzPat**. Elle permet aux clients de soumettre des réclamations, aux agents qualité de les traiter, et aux administrateurs de superviser l'ensemble du système.

---

## Table des matières

- [Aperçu](#aperçu)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Rôles utilisateurs](#rôles-utilisateurs)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement](#lancement)
- [API Reference](#api-reference)

---

## Aperçu

Le système prend en charge les types de réclamations suivants :
- Qualité produit
- Livraison / Délai de livraison
- Produit manquant
- Mauvaise quantité
- Erreur de commande

Chaque réclamation peut inclure des articles, des photos/vidéos, des messages de suivi, des rapports d'investigation et un historique de statut.

---

## Technologies

### Backend
| Technologie | Version |
|---|---|
| Python / Django | 5.2 |
| Django REST Framework | — |
| djangorestframework-simplejwt | — |
| django-cors-headers | — |
| SQLite3 | (développement) |

### Frontend
| Technologie | Version |
|---|---|
| React | 19.1.0 |
| React Router DOM | 7.7.0 |
| Bootstrap / React-Bootstrap | 5.3.7 / 2.10.10 |
| Chart.js / react-chartjs-2 | 4.5.0 |
| Styled Components | 6.1.19 |

---

## Architecture

```
Reclakenz/
├── Reclakenz/          # Configuration Django (settings, urls, wsgi, asgi)
├── apprecla/           # Application Django principale
│   ├── models.py       # Modèles de données
│   ├── views.py        # Endpoints API REST
│   ├── urls.py         # Routage API
│   └── admin.py        # Interface d'administration Django
├── frontend/           # Application React
│   └── src/
│       ├── components/ # Composants réutilisables
│       ├── hooks/
│       ├── theme/
│       └── App.js      # Routeur principal
├── media/              # Fichiers uploadés (photos, documents)
├── manage.py
└── db.sqlite3
```

---

## Fonctionnalités

- **Authentification JWT** — Access token (1h) + refresh token (1 jour)
- **Inscription avec validation admin** — Tout nouveau compte doit être approuvé
- **Soumission de réclamations** — Avec articles, variantes, photos et fichiers joints
- **Messagerie par réclamation** — Chat entre client et support
- **Rapports d'investigation** — Créés par les agents qualité
- **Notifications** — Mises à jour de statut en temps réel
- **Demandes de changement de rôle** — Les utilisateurs peuvent demander à devenir Commercial ou Agent Qualité
- **Tableau de bord admin** — Gestion des utilisateurs, entreprises, articles
- **Statistiques commerciales** — Vue globale de toutes les réclamations
- **Interface Django Admin** — Gestion avancée des données

---

## Rôles utilisateurs

| Rôle | Accès |
|---|---|
| **Client** | Soumettre et suivre ses propres réclamations |
| **Commercial** | Voir et gérer toutes les réclamations |
| **Agent Qualité** | Traiter les réclamations, créer des rapports |
| **Admin** | Accès complet : utilisateurs, entreprises, articles, approbations |

> Tous les nouveaux comptes nécessitent une approbation de l'administrateur.

---

## Installation

### Prérequis

- Python 3.10+
- Node.js 18+ et npm
- Git

### Backend

```bash
# Cloner le dépôt
git clone <url-du-repo>
cd Reclakenz

# Créer et activer l'environnement virtuel
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# Installer les dépendances
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# Appliquer les migrations
python manage.py migrate

# Créer un super-utilisateur
python manage.py createsuperuser

# (Optionnel) Charger des données de test
python create_test_user.py
```

### Frontend

```bash
cd frontend
npm install
```

---

## Configuration

### Backend — `Reclakenz/settings.py`

```python
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
CORS_ALLOW_ALL_ORIGINS = True   # Développement uniquement

# JWT
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
```

### Frontend — URL de l'API

Dans les fichiers source, l'URL de base est définie à :

```
http://localhost:8000
```

Les tokens JWT sont stockés dans le `localStorage` sous les clés `access` et `refresh`.

---

## Lancement

### Démarrer le backend

```bash
python manage.py runserver
```

> API disponible sur : `http://localhost:8000`  
> Admin Django : `http://localhost:8000/admin`

### Démarrer le frontend

```bash
cd frontend
npm start
```

> Application disponible sur : `http://localhost:3000`

---

## API Reference

### Authentification

| Méthode | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register/` | Inscription utilisateur |
| `POST` | `/api/token/` | Obtenir un token JWT |
| `POST` | `/api/token/refresh/` | Rafraîchir le token |

### Réclamations

| Méthode | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/reclamations/` | Lister / créer ses réclamations |
| `GET/PUT/DELETE` | `/api/reclamations/<id>/` | Détails d'une réclamation |
| `GET` | `/api/all-reclamations/` | Toutes les réclamations (commercial/admin) |
| `GET/POST` | `/api/reclamations/<id>/photos/` | Photos d'une réclamation |
| `GET/POST` | `/api/reclamations/<id>/messages/` | Messages d'une réclamation |
| `GET/POST` | `/api/reclamations/<id>/reports/` | Rapports d'investigation |

### Articles

| Méthode | Endpoint | Description |
|---|---|---|
| `GET/POST` | `/api/articles/` | Lister / créer des articles |
| `GET/PUT/DELETE` | `/api/articles/<id>/` | Détails d'un article |
| `GET/POST` | `/api/articles/<id>/variants/` | Variantes d'un article |

### Utilisateurs & Admin

| Méthode | Endpoint | Description |
|---|---|---|
| `GET/PATCH` | `/api/profile/` | Profil utilisateur |
| `GET/POST` | `/api/admin/users/` | Gestion des utilisateurs |
| `GET/POST` | `/api/admin/companies/` | Gestion des entreprises |
| `GET` | `/api/pending-registrations/` | Inscriptions en attente |
| `GET` | `/api/notifications/` | Notifications |

---

## Entreprises supportées

| Nom | Code |
|---|---|
| Vetadis | `vetadis` |
| Kenz Maroc | `kenz_maroc` |
| KenzPat | `kenzpat` |
