<!-- assets-check-comment -->
# 🖼️ Rapport d'Analyse des Assets

{{^hasIssues}}
✅ **Tous les assets sont conformes !** Aucun fichier trop lourd et aucune référence cassée détectée.
{{/hasIssues}}

{{#hasHeavyAssets}}
### ⚠️ Assets trop lourds (> 5 Mo)
<details>
  <summary>Voir les détails ({{heavyAssets.length}} fichiers)</summary>

| Fichier | Taille |
|---------|--------|
{{#heavyAssets}}
| `{{name}}` | {{size}} |
{{/heavyAssets}}

</details>
{{/hasHeavyAssets}}

{{#hasBrokenReferences}}
### ❌ Références cassées (Assets manquants)
Ces fichiers sont cités dans le code mais n'existent pas dans le dossier `src/assets`.

<details>
  <summary>Afficher les cas détectés ({{brokenReferences.length}} références)</summary>

| Fichier source | Référence détectée |
|----------------|--------------------|
{{#brokenReferences}}
| `{{source}}` | `{{reference}}` |
{{/brokenReferences}}

</details>
{{/hasBrokenReferences}}

---
💡 *Maintenez des assets légers pour des performances optimales.*
