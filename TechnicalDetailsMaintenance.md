# 🏗️ Détails Techniques & Maintenance

Ce guide est destiné aux mainteneurs de la bibliothèque `shared-workflows`.

---

## 📐 Architecture "Zero-Logic"

Le système repose sur une architecture hybride optimisée pour la maintenance :

1.  **Orchestrateurs Réutilisables** (`.github/workflows/`) : 
    - Interfaces publiques (`workflow_call`).
    - Ne contiennent aucune logique métier complexe.
    - Gèrent uniquement les checkouts et le passage des inputs/secrets.
2.  **Actions Composites** (`.github/actions/`) : 
    - Encapsulent la logique réelle (Hadolint, Trivy, PowerShell).
    - Exécutées dans l'environnement du job parent (ultra-rapides).
3.  **Scripts JS & PWSH** : 
    - Utilisés pour les tâches complexes (Génération du patchnote, Vérification de version).
    - Favorisent le multi-plateforme (Linux/Windows).

---

## 📂 Structure du dépôt

```
.github/
├── actions/     # Logique métier (Actions Composites)
├── configs/     # Configurations de base (Standards de l'Org)
├── scripts/     # Logique JavaScript (Node.js) et PowerShell
├── template/    # Templates Markdown Mustache pour les commentaires
└── workflows/   # Orchestrateurs (Workflows Réutilisables)
```

---

## ⚡ Standard Node 24 (Avril 2026)

Depuis avril 2026, GitHub a arrêté le support de Node 20. Cette bibliothèque est 100% conforme :

- **Runtime GitHub Actions** : Toutes les actions utilisent `checkout@v6` et le flag `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true`.
- **Runtime Applicatif** : Les orchestrateurs injectent `setup-node@v6` avec Node 22.x pour garantir la stabilité de vos outils de build.
- **Runners auto-hébergés** : Assurez-vous d'utiliser une version >= `v2.329.0`.

---

## 🔧 Maintenance

### 1. Ajout d'un nouveau module
1. Créer le dossier dans `.github/actions/<nom>`.
2. Créer l'`action.yml` avec la logique.
3. Créer l'orchestrateur dans `.github/workflows/<nom>-check.yml`.
4. Documenter le module dans `WorkflowUserGuide.md`.

### 2. Scripts PowerShell
Les scripts PWSH sont utilisés pour la manipulation Git complexe (ls-remote, tag comparison). Utilisez toujours `shell: pwsh` pour une compatibilité croisée.
