<!-- eslint-check-comment -->
# 🕵️ Rapport de Linting (ESLint)

{{#success}}
✅ **Code impeccable !** Aucune erreur de style ou de typage détectée par ESLint.
{{/success}}

{{^success}}
⚠️ **Des problèmes de qualité de code ont été détectés.**

| 📊 Statistiques | Total |
|-----------------|-------|
| ❌ Erreurs | {{errorCount}} |
| ⚠️ Avertissements | {{warningCount}} |

<details>
<summary>🔍 Cliquez pour voir les détails des erreurs (Top 50)</summary>

| Fichier | Ligne | Règle | Message |
|---------|-------|-------|---------|
{{#detail}}
| `{{filePath}}` | {{line}}:{{column}} | `{{ruleId}}` | {{message}} |
{{/detail}}

{{#truncated}}
*... et {{remainingCount}} autres problèmes non affichés.*
{{/truncated}}
</details>

---
💡 *Astuce : Vous pouvez corriger automatiquement la plupart de ces problèmes en local avec :*
```bash
npm run lint -- --fix
```
{{/success}}
