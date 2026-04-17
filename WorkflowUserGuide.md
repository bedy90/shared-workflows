# 🚀 Mode d'emploi des Workflows

Ce guide détaille l'utilisation de chaque module disponible dans la bibliothèque `shared-workflows`.

---

## 🕵️ PR Analysis (Analyse complète - Recommandé)

Le workflow `pr-analysis.yml` est un orchestrateur optimisé qui exécute toutes les vérifications pertinentes (Angular, ViTest, ESLint, Sécurité) en un seul job pour gagner du temps.

**Avantages :**
- Un seul `npm install` (Optimisation du temps de build).
- Détection automatique des technologies (Angular/ViTest).
- Orchestration intelligente des Labels (**Sync + PR Labeler**).
- **Dual-Config** : Support des fichiers locaux `.github/labels.yml` et `.github/labeler.yml` pour surcharger les standards de l'organisation.
- Rapport global consolidé dans les commentaires de la PR.

```yaml
jobs:
  analysis:
    name: "PR Analysis (Security & Quality)"
    uses: bedy90/shared-workflows/.github/workflows/pr-analysis.yml@dev
    permissions:
      contents: read
      pull-requests: write
      checks: write
    secrets:
      # Option A : Passage explicite (Recommandé)
      gitleaks_license: ${{ secrets.GITLEAKS_LICENSE }}
      # Option B : Héritage global (Simplifié)
      # secrets: inherit
    with:
      enable_labeler: true # Active la sync auto des labels + Attribution auto
```

---

## 🧱 Workflows par Module (Usage individuel)

Si vous avez besoin d'un contrôle granulaire, vous pouvez appeler chaque module séparément :

### 🛡️ Sécurité (`security-check.yml`)
Combine Trivy (vulnérabilités FS), NPM Audit (dépendances) et Gitleaks (secrets).
```yaml
name: "Security Audit"
uses: bedy90/shared-workflows/.github/workflows/security-check.yml@dev
secrets:
  gitleaks_license: ${{ secrets.GITLEAKS_LICENSE }}
```

### 🎨 Linter (`linter-check.yml`)
Exécute ESLint sur l'ensemble du projet.
```yaml
name: "Linter (ESLint)"
uses: bedy90/shared-workflows/.github/workflows/linter-check.yml@dev
```

### ✍️ Validation des Messages (Conventional Commits)
Vérifie que les titres de PR ou messages de commit respectent le format `type: description` (ex: `feat: add login`). Indispensable pour que le **Release Drafter** puisse générer le patchnote automatiquement.

**Comment corriger un message invalide ?**
- Si le titre de la PR est invalide : Éditez simplement le titre sur GitHub.
- Si un commit est invalide : Faire un `git rebase -i` puis `reword` (Optionnel si vous utilisez **Squash & Merge**).

```yaml
name: "Commit Msg Check"
uses: bedy90/shared-workflows/.github/workflows/commit-msg-check.yml@dev
```

### 🆙 Dépendances (`dependency-check.yml`)
Vérifie les packages obsolètes (`npm outdated`).
```yaml
name: "Dependency Audit"
uses: bedy90/shared-workflows/.github/workflows/dependency-check.yml@dev
```

### 🅰️ Angular (`angular-check.yml`)
Build de production + vérification de l'intégrité des assets + tests unitaires.
```yaml
name: "Angular Quality Check"
uses: bedy90/shared-workflows/.github/workflows/angular-check.yml@dev
with:
  enable_coverage: true
```

### ⚡ ViTest (`vitest-check.yml`)
Exécute les tests unitaires via ViTest.
```yaml
name: "ViTest Unit Tests"
uses: bedy90/shared-workflows/.github/workflows/vitest-check.yml@dev
with:
  enable_coverage: true
```

### 🏷️ Labeler (`labeler-check.yml`)
Auto-labeling des PR **+** Synchronisation automatique des labels de l'organisation.

**Fonctionnement Dual-Config :**
- Si un fichier `.github/labels.yml` est présent localement, il est fusionné avec le standard. En cas de conflit (même nom), votre version **locale** l'emporte (couleur, description).
- Idem pour `.github/labeler.yml` concernant les règles d'attribution.

```yaml
name: "Labeler & Org Sync"
uses: bedy90/shared-workflows/.github/workflows/labeler-check.yml@dev
with:
  enable_labeler: true
  delete_other_labels: false
```

#### ⚠️ Format requis pour `.github/labeler.yml` (v6)

Le module utilise `actions/labeler@v6`. Si vous surchargez ce fichier localement, vous **devez** utiliser le format de liste d'objets avec la clé `changed-files`. Une simple liste de chaînes de caractères provoquera une erreur.

**Exemple de format valide :**
```yaml
"area:components":
  - changed-files:
    - any-glob-to-any-file: "src/components/**/*"

"area:shared":
  - changed-files:
    - any-glob-to-any-file: ["src/shared/**/*", "libs/shared/**/*"]
```

### 🔄 Synchronisation des Labels (`label-sync.yml`)
Si vous souhaitez uniquement synchroniser la liste des labels standards sans activer l'auto-labeling des PRs.
```yaml
name: "Label Sync Only"
uses: bedy90/shared-workflows/.github/workflows/label-sync.yml@dev
with:
  delete_other_labels: false
```

### 📝 Release Drafter (`release-drafter.yml`)
Prépare les brouillons de release et génère un patchnote détaillé (Commits + WorkItems).
```yaml
name: "Release Drafting (Patchnote Pro)"
uses: bedy90/shared-workflows/.github/workflows/release-drafter.yml@dev
with:
  enable_release_drafter: true
```

### 🐳 Docker (`docker-check.yml`)
Validation Dockerfile, Docker-Compose et sécurité (Trivy).
```yaml
name: "Docker Security Audit"
uses: bedy90/shared-workflows/.github/workflows/docker-check.yml@dev
with:
  check_docker_compose: true
```

---

## 🏷️ Contrôle de Version

Vérifie que la version dans le `package.json` a bien été incrémentée et que le tag n'existe pas déjà sur le dépôt distant.

**Exemple d'implémentation (PR vers main) :**
```yaml
on:
  pull_request:
    branches: [main, prod]
jobs:
  version_check:
    name: "Version Increment Validation"
    uses: bedy90/shared-workflows/.github/workflows/check-version-pr.yml@dev
    permissions:
      contents: read
      pull-requests: write
      checks: write
```
