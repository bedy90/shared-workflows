# ⚙️ Configuration & Sécurité

Ce guide détaille les paramètres de sécurité et les options de configuration de la bibliothèque `shared-workflows`.

---

## 🔑 Gestion du secret GITLEAKS_LICENSE

Le secret `GITLEAKS_LICENSE` peut être configuré à trois niveaux selon vos besoins :

*   **🌐 Niveau Utilisateur** : Allez dans vos *Settings utilisateur* -> *Secrets and variables* -> *Actions*. Disponible pour tous vos dépôts personnels.
*   **🏢 Niveau Organisation** : Allez dans les *Settings de l'Organisation* -> *Secrets and variables* -> *Actions*. Partagé entre tous les dépôts de l'org. **(Recommandé)**.
*   **📁 Niveau Projet** : Allez dans les *Settings du dépôt* -> *Secrets and variables* -> *Actions*. Uniquement pour ce projet précis.

---

## 🏷️ Catalogue des Labels Standards

La synchronisation automatique (`labeler-check.yml` ou `label-sync.yml`) utilise ces définitions basées sur le dépôt central.

| Label | Description | Couleur |
| :--- | :--- | :--- |
| **`area:devops`** | CI/CD, Workflows, Infrastructure | `Blue` |
| **`area:documentation`** | README, Docs techniques, Commentaires | `SkyBlue` |
| **`area:testing`** | Tests, Couverture de code | `Yellow` |
| **`area:security`** | Vulnérabilités, Gitleaks, Trivy | `Red` |
| **`type:feature`** | Nouvelle fonctionnalité majeure | `Green` |
| **`type:fix`** | Correction de bug ou erreur | `Red` |
| **`type:enhancement`** | Amélioration ou ajout mineur | `Cyan` |
| **`type:breaking-change`** | Changement cassant la compatibilité | `Maroon` |

---

## 🎨 Configuration de Dépôt

### 1. Accès au Dépôt Partagé (Si Privé)
Si ce dépôt est privé, créez un **Fine-grained Personal Access Token (PAT)** avec accès lecture et ajoutez-le en tant que secret (ex: `GH_PAT_TOKEN`) dans votre projet cible. Utilisez-le via l'input `workflow_token`.

### 2. Smart Merge (Surcharge de config)
Les workflows `labeler-check` et `release-drafter` utilisent un système de fusion intelligente :
1. **Défaut** : Utilise les fichiers standards définis dans ce dépôt (`.github/configs/`).
2. **Surcharge** : Si vous créez un fichier `.github/labeler.yml` dans votre dépôt, ses règles seront **ajoutées** aux règles standards (Deep Merge). Vos règles locales ont la priorité en cas de conflit.

---

## 🔑 Permissions Requises
Dans le dépôt cible (**Settings** -> **Actions** -> **General**) :
- **Workflow permissions** : "Read and write permissions".
- Cocher "Allow GitHub Actions to create and approve pull requests".
