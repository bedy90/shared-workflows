# 🛠️ Shared Workflow Repository

Ce dépôt contient les workflows GitHub Actions centralisés et réutilisables pour l'ensemble des projets de l'organisation.

## 🚀 Workflows Disponibles

### 🕵️ PR Analysis (`PR Analysis.yml`)

Analyse de sécurité et de qualité du code sur les Pull Requests.

**Inclus :**

- 🛡️ **Trivy** : Scan de vulnérabilités dans le système de fichiers.
- 📦 **NPM Audit** : Vérification des dépendances NPM vulnérables.
- 🆙 **NPM Outdated** : Liste des packages obsolètes avec type de changement (Major, Minor, Patch).
- 🎨 **ESLint** : Vérification de la qualité du code (si ESLint est défini dans le projet).

---

## 📖 Comment l'utiliser ?

Pour utiliser ce workflow dans un autre dépôt, créez un fichier `.github/workflows/reusable-analysis.yml` dans votre projet cible :

```yaml
name: Global Analysis

on:
  pull_request:
    # définir la liste des branche ciblés
    branches: [main, dev, prod]

jobs:
  security-and-quality:
    # Remplacez [NOM_ORG] par le nom de votre organisation
    uses: bedy90/shared-workflows/.github/workflows/pr-analysis.yml@dev
    permissions:
      contents: read
      pull-requests: write
      checks: write
    secrets: inherit
```

### ⚙️ Pré-requis

- Le dépôt central `shared-workflows` doit être configuré pour autoriser l'accès aux autres dépôts de l'organisation (**Settings > Actions > General > Access**).
- Le projet cible doit avoir un fichier `package.json`.
- Pour ESLint, le script `eslint` doit être présent dans les `scripts` du `package.json`.

---

## 🏗️ Structure du Dépôt

- `.github/workflows/` : Définitions des workflows réutilisables.
- `.github/scripts/` : Scripts de traitement des rapports (Node.js).
- `.github/template/` : Templates Markdown pour les commentaires GitHub.
  Shared Workflow

# Configuration requise :

Par défaut, un dépôt privé ne peut pas être "appelé" par un autre. Vous devez aller dans :

- Settings du dépôt `shared-workflows`
- Actions -> General.
- Section **"Access"**.
- Cochez **"Accessible from repositories in the same organization"**.
