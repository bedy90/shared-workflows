# 🛠️ Shared Workflow Repository

Ce dépôt centralise les workflows GitHub Actions réutilisables pour l'ensemble des projets de l'organisation. Il garantit la standardisation de la sécurité, de la qualité et des processus de mise en prod.

---

## 🚀 Workflows Disponibles

Ce dépôt propose un orchestrateur global ou des modules individuels selon vos besoins :

### 🕵️ [PR Analysis](.github/workflows/pr-analysis.yml) (Recommandé)
Analyse complète regroupant : Sécurité (Trivy, NPM Audit, Gitleaks), Qualité (ESLint), Compatibilité (Case Check), Framework (Angular) et Tests (ViTest).

### 🧱 modules Individuels
Pour un usage granulaire, vous pouvez utiliser :
- `security-check.yml` : Scan de vulnérabilités et secrets.
- `linter-check.yml` : Qualité du code via ESLint.
- `dependency-check.yml` : Détection de packages obsolètes.
- `angular-check.yml` : Build, assets et Couverture de test Angular.
- `vitest-check.yml` : Tests unitaires et Couverture de test JavaScript/TypeScript.
- `commit-lint-check.yml` : Validation des messages de commit.
- `labeler-check.yml` : Automatisation des labels de PR (Smart Merge).
- `release-drafter.yml` : Préparation automatique des notes de version (Smart Merge).
- `docker-check.yml` : Validation Dockerfile, Docker-Compose et sécurité (Trivy).
- `check-version-pr.yml` : Contrôle de l'incrément de version.

---

## 📋 Sommaire

1. [🚀 Workflows & Mode d'emploi](#-workflows--mode-demploi)
   - [🕵️ PR Analysis (Analyse complète)](#-pr-analysis-analyse-complète)
   - [🧱 Workflows par Module (Usage individuel)](#-workflows-par-module-usage-individuel)
   - [🏷️ Contrôle de Version (Usage spécifique PR)](#-contrôle-de-version-usage-spécifique-pr)
2. [⚙️ Configuration & Sécurité](#-configuration--sécurité)
   - [🔑 Gestion du secret GITLEAKS_LICENSE](#-gestion-du-secret-gitleaks_license)
   - [🛡️ Paramètres Communs & Permissions](#-paramètres-communs--permissions)
   - [🎨 Configuration requise (ESLint, PAT, Accès)](#-configuration-requise-eslint-pat-accès)
3. [🏗️ Détails Techniques & Maintenance](#-détails-techniques--maintenance)
   - [📐 Architecture technique](#-architecture-technique)
   - [📂 Structure du dépôt](#-structure-du-dépôt)
   - [⚡ Compatibilité & Dépréciation Node 24/20](#-compatibilité--dépréciation-node-2420)

---

## 🚀 Workflows & Mode d'emploi

<details>
<summary id="🕵️-pr-analysis-analyse-complète"><strong>🕵️ PR Analysis (Analyse complète - Recommandé)</strong></summary>

Le workflow `pr-analysis.yml` est un orchestrateur optimisé qui exécute toutes les vérifications pertinentes (Angular, ViTest, ESLint, Sécurité) en un seul job pour gagner du temps.

**Avantages :** 
- Un seul `npm install`.
- Détection automatique des technos de votre projet.
- Rapport global consolidé.

```yaml
jobs:
  analysis:
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
```
</details>

<details>
<summary id="🧱-workflows-par-module-usage-individuel"><strong>🧱 Workflows par Module (Usage individuel)</strong></summary>

Si vous avez besoin d'un contrôle granulaire, vous pouvez appeler chaque module séparément :

*   **🛡️ Sécurité (`security-check.yml`)** : Combine Trivy (vulnérabilités FS), NPM Audit (dépendances) et Gitleaks (secrets).
    ```yaml
    uses: bedy90/shared-workflows/.github/workflows/security-check.yml@dev
    secrets:
      # Option A : Passage explicite (Recommandé)
      gitleaks_license: ${{ secrets.GITLEAKS_LICENSE }}
      # Option B : Héritage global (Simplifié)
      # secrets: inherit
    ```
*   **🎨 Linter (`linter-check.yml`)** : Exécute ESLint si présent.
    ```yaml
    uses: bedy90/shared-workflows/.github/workflows/linter-check.yml@dev
    ```
*   **🆙 Dépendances (`dependency-check.yml`)** : Vérifie les packages obsolètes (`npm outdated`).
    ```yaml
    uses: bedy90/shared-workflows/.github/workflows/dependency-check.yml@dev
    ```
*   **🅰️ Angular (`angular-check.yml`)** : Build de prod + vérification de l'intégrité des assets.
    ```yaml
    uses: bedy90/shared-workflows/.github/workflows/angular-check.yml@dev
    with:
      enable_coverage: true # Optionnel (default: false)
    ```
*   **⚡ ViTest (`vitest-check.yml`)** : Exécute les tests unitaires via ViTest.
    ```yaml
    uses: bedy90/shared-workflows/.github/workflows/vitest-check.yml@dev
    with:
      enable_coverage: true # Optionnel (default: false)
    ```
*   **🏷️ Labeler (`labeler-check.yml`)** : Automatise les labels basés sur les fichiers modifiés.
    ```yaml
    uses: bedy90/shared-workflows/.github/workflows/labeler-check.yml@dev
    with:
      enable_labeler: true
    ```
*   **📝 Release Drafter (`release-drafter.yml`)** : Prépare les brouillons de release et génère un patchnote détaillé.
    ```yaml
    uses: bedy90/shared-workflows/.github/workflows/release-drafter.yml@dev
    with:
      enable_release_drafter: true
    ```
*   **🐳 Docker (`docker-check.yml`)** : Validation Dockerfile, Docker-Compose et sécurité (Trivy).
    ```yaml
    uses: bedy90/shared-workflows/.github/workflows/docker-check.yml@dev
    with:
      check_docker_compose: true # Optionnel (inclut le scan des images du compose)
    ```
</details>

<details>
<summary id="🏷️-contrôle-de-version-usage-spécifique-pr"><strong>🏷️ Contrôle de Version (Usage spécifique PR)</strong></summary>

Vérifie que la version dans le `package.json` a bien été incrémentée et que le tag n'existe pas déjà. Recommandé pour cibler `main` ou `prod`.

**Option A : Fichier dédié (Restreint via le trigger)**
```yaml
on:
  pull_request:
    branches: [main, prod]
jobs:
  version_check:
    uses: bedy90/shared-workflows/.github/workflows/check-version-pr.yml@dev
    permissions:
      contents: read
      pull-requests: write
      checks: write
```

**Option B : Workflow global (Restreint via un 'if')**
```yaml
on:
  pull_request:
jobs:
  version_check:
    if: github.event.pull_request.base.ref == 'main' || github.event.pull_request.base.ref == 'prod'
    uses: bedy90/shared-workflows/.github/workflows/check-version-pr.yml@dev
    permissions:
      contents: read
      pull-requests: write
      checks: write
```
</details>

---

## ⚙️ Configuration & Sécurité

<details>
<summary id="🔑-gestion-du-secret-gitleaks_license"><strong>🔑 Gestion du secret GITLEAKS_LICENSE</strong></summary>

Le secret `GITLEAKS_LICENSE` peut être configuré à trois niveaux selon vos besoins :

*   **🌐 Niveau Utilisateur** : Allez dans vos *Settings utilisateur* -> *Secrets and variables* -> *Actions*. Disponible pour tous vos dépôts personnels.
*   **🏢 Niveau Organisation** : Allez dans les *Settings de l'Organisation* -> *Secrets and variables* -> *Actions*. Partagé entre tous les dépôts de l'org. **(Recommandé)**.
*   **📁 Niveau Projet** : Allez dans les *Settings du dépôt* -> *Secrets and variables* -> *Actions*. Uniquement pour ce projet précis.

> **Rappel :** Utilisez toujours `secrets: inherit` ou passez-le explicitement via le bloc `secrets: { gitleaks_license: ... }` dans votre YAML d'appel.
</details>

<details>
<summary id="🛡️-paramètres-communs--permissions"><strong>🛡️ Paramètres Communs & Permissions</strong></summary>

### ⚙️ Paramètres Communs (Inputs)

| Input | Description | Défaut |
| :--- | :--- | :--- |
| `workflow_token` | GITHUB_TOKEN ou PAT pour accéder au dépôt partagé | `""` |

### 🔑 Configuration des Secrets

| Secret | Description | Obligatoire |
| :--- | :--- | :--- |
| `gitleaks_license` | Licence commerciale Gitleaks | Non |

### 🔑 Permissions Requises
Dans le dépôt cible (**Settings** -> **Actions** -> **General**) :
- **Workflow permissions** : "Read and write permissions".
- Cocher "Allow GitHub Actions to create and approve pull requests".
</details>

<details>
<summary id="🎨-configuration-requise-eslint-pat-accès"><strong>🎨 Configuration requise (ESLint, PAT, Accès)</strong></summary>

### 1. Accès au Dépôt Partagé (Si Privé)
Si ce dépôt est privé, créez un **Fine-grained Personal Access Token (PAT)** avec accès lecture et ajoutez-le en tant que secret (ex: `GH_PAT_TOKEN`) dans votre projet cible. Utilisez-le via l'input `workflow_token`.

### 3. Gestion des Configurations Partagées (Smart Merge)
Les workflows `labeler-check` et `release-drafter` utilisent un système de fusion intelligente :
1. **Défaut** : Utilise les fichiers standards définis dans ce dépôt (`.github/configs/`).
2. **Surcharge** : Si vous créez un fichier `.github/labeler.yml` dans votre dépôt, ses règles seront **ajoutées** aux règles standards (Deep Merge). Vos règles locales ont la priorité en cas de conflit.

### 4. Intelligence Agent (Règles Antigravity)
Si vous utilisez l'agent Antigravity, les règles dans `shared-agent` ont été mises à jour pour :
- Forcer le format **Conventional Commits** (nécessaire pour le Release Drafter).
- Suggérer automatiquement les **Labels** lors de la génération d'un message de PR.

### 2. Ignorer les fichiers de CI pour ESLint
**Critique :** Ajoutez `.central-workflow` dans votre configuration ESLint pour éviter d'analyser les scripts du workflow partagé.

Exemple `eslint.config.js` :
```javascript
{
  ignores: ['.central-workflow', 'dist', 'node_modules'],
}
```
</details>

---

## 🏗️ Détails Techniques & Maintenance

<details>
<summary id="📐-architecture-technique"><strong>📐 Architecture technique</strong></summary>

Le système repose sur une architecture hybride :
1.  **Actions Composites** (`.github/actions/`) : Encapsulent la logique (scripts JS + templates). Ultra-rapides car exécutées dans l'environnement du job parent.
2.  **Actions Réutilisables** (`.github/workflows/`) : Interfaces publiques (`workflow_call`) qui orchestrent les actions composites.
3.  **Scripts JS** : Utilisent un helper standard (`github-comment-helper.cjs`) pour des rapports Markdown cohérents.
4.  **Vérification de Casse** : Inclus une détection automatique pour éviter les erreurs de clonage Windows/Linux (ex: `readme.md` vs `README.md`).
</details>

<details>
<summary id="📂-structure-du-dépôt"><strong>📂 Structure du dépôt</strong></summary>

- `.github/workflows/` : Définitions des workflows partagés (Interfaces).
- `.github/actions/` : Actions composites (Logique métier).
- `.github/scripts/` : Logic JS (Node.js) et helpers.
- `.github/template/` : Templates Markdown Mustache pour les commentaires GitHub.
</details>

<details>
<summary id="⚡-compatibilité-&-dépréciation-node-2420"><strong>⚡ Compatibilité & Dépréciation Node 24/20</strong></summary>

### 🚀 Migration Node 24
Depuis avril 2026, tous les workflows utilisent :
- `actions/checkout@v6`, `actions/setup-node@v6`.
- `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true` pour garantir l'exécution sur le runtime le plus récent.

### ⚠️ Fin de support Node 20
GitHub a arrêté le support de Node 20 le **1er avril 2026**. Ce dépôt est 100% compatible avec les nouveaux standards.

**Runners auto-hébergés :** Assurez-vous d'utiliser une version >= `v2.329.0` pour supporter Node 24.
</details>

---

_Dernière mise à jour : Avril 2026 - Migration Node 24 effectuée._