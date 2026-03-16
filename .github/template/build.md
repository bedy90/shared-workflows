<!-- build-check-comment -->
# 🚀 Rapport de Santé du Build

{{^hasWarnings}}
✅ **Build réussi sans aucun avertissement !** Le code est propre et respecte les budgets de taille.
{{/hasWarnings}}

{{#hasWarnings}}
⚠️ **Build réussi avec des points d'attention :**

<details>
  <summary>Afficher les avertissements ({{warnings.length}} messages)</summary>

| Type | Message |
|------|---------|
{{#warnings}}
| ⚠️ Warning | `{{.}}` |
{{/warnings}}

</details>
{{/hasWarnings}}

{{#hasBundles}}
### 📊 Statistiques des Bundles
<details>
  <summary>Voir le détail des bundles ({{bundles.length}} fichiers)</summary>

| Fichier | Taille (Raw) |
|---------|--------------|
{{#bundles}}
| `{{name}}` | {{size}} |
{{/bundles}}

</details>
{{/hasBundles}}

{{^hasBundles}}
⚠️ **Aucune donnée de bundle détectée.** Cela peut arriver si le build a échoué ou si le format de sortie a changé.
{{/hasBundles}}

---
💡 *Surveillez les budgets de taille pour maintenir les performances de chargement du BedyBot.*
