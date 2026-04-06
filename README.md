# 🛠️ Shared Workflow Repository

Ce dépôt centralise les workflows GitHub Actions réutilisables pour l'ensemble des projets de l'organisation. Il garantit la standardisation de la sécurité, de la qualité et des processus de mise en prod (Standards **Node 24 / Avril 2026**).

---

## 📖 Sommaire de la Documentation

Pour une navigation optimale, la documentation a été scindée en quatre guides thématiques :

### 🚀 [Workflow User Guide](./WorkflowUserGuide.md)
Le catalogue complet des modules (Angular, ViTest, Docker, Labels, Version) avec des exemples YAML prêts à l'emploi.

### ⚙️ [Configuration & Security](./ConfigurationSecurity.md)
Gestion des secrets (Gitleaks), catalogue des labels standards et fonctionnement de la fusion intelligente des configurations.

### 🏗️ [Technical Details & Maintenance](./TechnicalDetailsMaintenance.md)
Architecture "Zero-Logic", détails sur le standard Node 24 (Avril 2026) et guide de maintenance pour les contributeurs.

---

## ⚡ Quick Start : PR Analysis (Recommandé)

Le workflow `pr-analysis.yml` est l'orchestrateur global qui exécute automatiquement tous les contrôles pertinents pour votre projet en un seul job.

```yaml
jobs:
  analysis:
    uses: bedy90/shared-workflows/.github/workflows/pr-analysis.yml@dev
    permissions:
      contents: read
      pull-requests: write
      checks: write
    secrets:
      gitleaks_license: ${{ secrets.GITLEAKS_LICENSE }}
```

---

## 🕵️ Workflows Disponibles (Vue d'Ensemble)

| Module | Description | Guide |
| :--- | :--- | :--- |
| **`pr-analysis`** | Orchestrateur complet (Sécurité, Qualité, Framework) | [Consulter](./WorkflowUserGuide.md#🕵️-pr-analysis-analyse-complète---recommandé) |
| **`security`** | Audit Gitleaks, NPM Audit et Trivy (FS) | [Consulter](./WorkflowUserGuide.md#🛡️-sécurité-security-checkyml) |
| **`quality`** | ESLint, Outdated et Case Check | [Consulter](./WorkflowUserGuide.md#🎨-linter-linter-checkyml) |
| **`docker`** | Hadolint, Trivy (FS/Config) et Compose | [Consulter](./WorkflowUserGuide.md#🐳-docker-docker-checkyml) |
| **`version`** | Contrôle incrément package.json + Tag Git | [Consulter](./WorkflowUserGuide.md#🏷️-contrôle-de-version) |
| **`release-drafter`** | Brouillons de Release + Patchnote Pro | [Consulter](./WorkflowUserGuide.md#📝-release-drafter-release-drafteryml) |

---

_Dernière mise à jour : Avril 2026 - Migration Node 24 terminée._