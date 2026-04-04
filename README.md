# 🛠️ Shared Workflow Repository

Ce dépôt contient les workflows GitHub Actions centralisés et réutilisables pour l'ensemble des projets de l'organisation.

## 🚀 Workflows Disponibles

### 🕵️ PR Analysis (`PR Analysis.yml`)

Analyse de sécurité et de qualité du code sur les Pull Requests.

**Inclus :**

- 🛡️ **Security Check** : Scan de vulnérabilités (Trivy), audit des dépendances (NPM Audit) et détection de secrets (Gitleaks).
- 🆙 **Dependency Check** : Liste des packages obsolètes (NPM Outdated).
- 🎨 **Linter Check** : Qualité du code via ESLint (automatiquement activé si présent).
- 🔠 **Case Check** : Vérification de la casse des noms de fichiers pour la compatibilité Windows/Linux.
- 🅰️ **Angular Check** : Build et vérification des assets (polices, vidéos, audio, images modernes).
- ⚡ **ViTest Check** : Exécution des tests unitaires (si `vitest` est présent).
- 📝 **Commit Lint** : Validation des messages de commit (prêt pour activation future).

---

### 🧱 Workflows Individuels (Modulaires)

Vous pouvez utiliser chaque module séparément selon vos besoins :

- `security-check.yml`
- `dependency-check.yml`
- `linter-check.yml`
- `angular-check.yml`
- `vitest-check.yml`
- `commit-lint-check.yml`

## ⚙️ Architecture Technique

Le système repose sur une architecture hybride optimisée :

1. **Actions Composites** : Situées dans `.github/actions/`, elles encapsulent la logique réelle (scripts + outils). Elles sont conçues pour être ultra-rapides en s'exécutant dans le même environnement que le job parent.
2. **Actions Réutilisables** : Situées dans `.github/workflows/`, elles servent d'interfaces publiques. Elles appellent les actions composites.
3. **Scripts JS & Templates** : Utilisent un helper standardisé pour garantir des rapports visuels cohérents sur GitHub.

### 🔠 Vérification de la Casse

Le système inclut désormais une vérification automatique de la casse des noms de fichiers. Si deux fichiers ont des noms identiques à la casse près (ex: `readme.md` et `README.md`), un avertissement sera posté. Cela prévient les erreurs de clonage fatales sur Windows.

---

## 🚀 Utilisation des Workflows

### 🌟 Option 1 : Analyse Complète (Recommandé)

Le workflow `pr-analysis.yml` est un orchestrateur optimisé qui exécute toutes les vérifications pertinentes pour votre projet en un seul job. Il détecte automatiquement si votre projet utilise Angular, ViTest ou ESLint.

**Avantages :** Gain de temps (un seul `npm install`), vision globale.

```yaml
jobs:
  analysis:
    uses: bedy90/shared-workflows/.github/workflows/pr-analysis.yml@dev
    permissions:
      contents: read
      pull-requests: write
      checks: write
    secrets: inherit # Nécessaire pour Gitleaks et Trivy
```

---

### 🧱 Option 2 : Utilisation par Module

Si vous avez besoin d'un contrôle granulaire, vous pouvez appeler chaque module séparément.

#### 🛡️ Sécurité (`security-check.yml`)

Combine Trivy (vulnérabilités FS), NPM Audit (dépendances) et Gitleaks (secrets).

```yaml
uses: bedy90/shared-workflows/.github/workflows/security-check.yml@dev
```

#### 🎨 Linter (`linter-check.yml`)

Exécute ESLint. S'active uniquement si `eslint` est présent dans le `package.json`.

```yaml
uses: bedy90/shared-workflows/.github/workflows/linter-check.yml@dev
```

#### 🆙 Dépendances (`dependency-check.yml`)

Vérifie les packages obsolètes via `npm outdated`.

```yaml
uses: bedy90/shared-workflows/.github/workflows/dependency-check.yml@dev
```

#### 🅰️ Angular (`angular-check.yml`)

Effectue le build de production et vérifie l'intégrité des assets.

```yaml
uses: bedy90/shared-workflows/.github/workflows/angular-check.yml@dev
```

#### ⚡ ViTest (`vitest-check.yml`)

Exécute les tests unitaires via ViTest.

```yaml
uses: bedy90/shared-workflows/.github/workflows/vitest-check.yml@dev
```

---

## ⚙️ Paramètres Communs

Tous les workflows acceptent les inputs suivants :

| Input | Description | Défaut |
| :--- | :--- | :--- |
| `workflow_token` | GITHUB_TOKEN ou PAT pour accéder au dépôt partagé | `""` |

---

---

## 🛠️ Configuration Requise

Pour utiliser ces workflows dans un autre dépôt, assurez-vous de configurer les points suivants :

### 1. Autoriser les Workflows Partagés
Dans le dépôt cible :
- Allez dans **Settings** > **Actions** > **General**.
- Dans **Workflow permissions**, sélectionnez **Read and write permissions**.
- Cochez **Allow GitHub Actions to create and approve pull requests**.

### 2. Accès au Dépôt Partagé (Si Privé)
Si ce dépôt `shared-workflows` est privé :
- Vous devez créer un **Fine-grained Personal Access Token (PAT)** avec les accès en lecture sur ce dépôt.
- Ajoutez ce token comme **Secret** dans le dépôt cible (nommé par exemple `GH_PAT_TOKEN`).
- Utilisez-le dans l'input `workflow_token`.
- **Note importante** : Pour les projets utilisant ESLint, assurez-vous d'ignorer le répertoire `.central-workflow` dans votre configuration (ex: `eslint.config.js`) pour éviter que le linter n'analyse les fichiers internes du workflow partagé.

---

## 🏗️ Structure du Dépôt

- `.github/workflows/` : Définitions des workflows réutilisables (Interfaces).
- `.github/actions/` : Actions composites (Logique métier optimisée).
- `.github/scripts/` : Logic JS (Node.js) utilisant `github-comment-helper.cjs`.
- `.github/template/` : Templates Markdown Mustache pour les commentaires.
