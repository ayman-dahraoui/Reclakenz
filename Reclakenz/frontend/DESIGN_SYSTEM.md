# Système de Design Professionnel - Reclakenz

## Vue d'ensemble

Ce système de design professionnel offre une interface utilisateur moderne, cohérente et accessible pour l'application Reclakenz. Il utilise des variables CSS pour maintenir la cohérence et facilite la maintenance.

## Variables CSS

### Couleurs

```css
--primary-color: #2563eb;      /* Bleu principal */
--primary-dark: #1d4ed8;       /* Bleu foncé */
--primary-light: #3b82f6;      /* Bleu clair */
--secondary-color: #64748b;    /* Gris secondaire */
--accent-color: #f59e0b;       /* Orange accent */
--success-color: #10b981;      /* Vert succès */
--danger-color: #ef4444;       /* Rouge danger */
--warning-color: #f59e0b;      /* Orange avertissement */
--info-color: #06b6d4;         /* Bleu info */
```

### Arrière-plans

```css
--background-primary: #ffffff;    /* Blanc principal */
--background-secondary: #f8fafc; /* Gris très clair */
--background-tertiary: #f1f5f9;  /* Gris clair */
```

### Texte

```css
--text-primary: #1e293b;    /* Texte principal */
--text-secondary: #64748b;  /* Texte secondaire */
--text-muted: #94a3b8;      /* Texte atténué */
```

### Ombres

```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

### Rayons de bordure

```css
--radius-sm: 0.375rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;
```

### Espacement

```css
--spacing-1: 0.25rem;   /* 4px */
--spacing-2: 0.5rem;    /* 8px */
--spacing-3: 0.75rem;   /* 12px */
--spacing-4: 1rem;      /* 16px */
--spacing-5: 1.25rem;   /* 20px */
--spacing-6: 1.5rem;    /* 24px */
--spacing-8: 2rem;      /* 32px */
--spacing-10: 2.5rem;   /* 40px */
--spacing-12: 3rem;     /* 48px */
```

## Composants

### PageLayout

Composant de mise en page principal pour toutes les pages.

```jsx
import { PageLayout } from './components';

<PageLayout 
  title="Titre de la page"
  subtitle="Sous-titre optionnel"
  showHeader={true}
  maxWidth="1200px"
>
  {/* Contenu de la page */}
</PageLayout>
```

### ProfessionalCard

Carte professionnelle réutilisable avec plusieurs variantes.

```jsx
import { ProfessionalCard } from './components';

<ProfessionalCard
  title="Titre de la carte"
  subtitle="Sous-titre"
  icon={<i className="fas fa-icon"></i>}
  hoverable={true}
  shadow="md"
  status="success"
>
  {/* Contenu de la carte */}
</ProfessionalCard>
```

### ProfessionalButton

Bouton professionnel avec états de chargement et icônes.

```jsx
import { ProfessionalButton } from './components';

<ProfessionalButton
  variant="primary"
  size="md"
  icon={<i className="fas fa-save"></i>}
  loading={false}
  fullWidth={false}
  onClick={handleClick}
>
  Texte du bouton
</ProfessionalButton>
```

### ProfessionalTable

Tableau professionnel avec gestion des états de chargement.

```jsx
import { ProfessionalTable } from './components';

const columns = [
  { key: 'name', header: 'Nom' },
  { key: 'email', header: 'Email' },
  { 
    key: 'status', 
    header: 'Statut',
    render: (value) => <span className={`badge badge-${value}`}>{value}</span>
  }
];

<ProfessionalTable
  columns={columns}
  data={data}
  loading={false}
  striped={true}
  hover={true}
/>
```

### DashboardStats

Composant pour afficher les statistiques du tableau de bord.

```jsx
import { DashboardStats } from './components';

const stats = [
  {
    type: 'users',
    value: '1,234',
    label: 'Utilisateurs',
    description: 'Total des utilisateurs actifs',
    trend: 12
  },
  {
    type: 'claims',
    value: '567',
    label: 'Réclamations',
    description: 'Réclamations en cours',
    trend: -5
  }
];

<DashboardStats stats={stats} />
```

## Classes utilitaires

### Couleurs de texte
- `.text-primary`
- `.text-success`
- `.text-danger`
- `.text-warning`
- `.text-info`
- `.text-muted`

### Couleurs d'arrière-plan
- `.bg-primary`
- `.bg-success`
- `.bg-danger`
- `.bg-warning`
- `.bg-info`
- `.bg-light`

### Bordures
- `.border-primary`
- `.border-success`
- `.border-danger`
- `.border-warning`
- `.border-info`

### Espacement
- `.p-1` à `.p-6` (padding)
- `.m-1` à `.m-6` (margin)
- `.gap-1` à `.gap-4` (gap)

### Affichage
- `.d-flex`
- `.d-block`
- `.d-none`
- `.w-100`
- `.h-100`

## Responsive Design

Le système est entièrement responsive avec des breakpoints :

- **Mobile** : < 480px
- **Tablet** : < 768px
- **Desktop** : ≥ 768px

## Animations

### Transitions
Tous les composants utilisent des transitions fluides de 0.3s.

### Animations CSS
- `fadeIn` : Apparition en fondu
- `slideIn` : Glissement depuis la gauche
- `pulse` : Effet de pulsation
- `bounce` : Effet de rebond

## Accessibilité

- Utilisation de `visually-hidden` pour le contenu accessible aux lecteurs d'écran
- Contraste de couleurs conforme aux standards WCAG
- Navigation au clavier supportée
- États de focus visibles

## Utilisation

1. **Importer les composants** :
```jsx
import { PageLayout, ProfessionalCard, ProfessionalButton } from './components';
```

2. **Utiliser les variables CSS** :
```css
.my-component {
  background-color: var(--background-primary);
  color: var(--text-primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}
```

3. **Appliquer les classes utilitaires** :
```jsx
<div className="d-flex justify-content-between align-items-center gap-3">
  <span className="text-primary">Texte principal</span>
  <button className="btn btn-success">Action</button>
</div>
```

## Maintenance

- Modifier les variables CSS dans `App.css` pour changer le thème global
- Ajouter de nouveaux composants dans le dossier `components/`
- Mettre à jour ce document lors de l'ajout de nouvelles fonctionnalités 