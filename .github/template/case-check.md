## 🔠 Vérification de la casse

{{#hasConflicts}}
> [!CAUTION]
> **Conflits de casse détectés !**
> Certains fichiers ont des noms identiques à la casse près. Cela causera des erreurs sur les systèmes Windows ou macOS.

<details>
  <summary>Voir la liste des conflits ({{conflicts.length}} paires)</summary>

| Fichier 1 | Fichier 2 |
| :--- | :--- |
{{#conflicts}}
| `{{file1}}` | `{{file2}}` |
{{/conflicts}}

</details>

**Action requise** : Veuillez renommer l'un des fichiers pour éviter toute confusion.
{{/hasConflicts}}

{{^hasConflicts}}
✅ Aucun conflit de casse détecté dans la nomenclature des fichiers.
{{/hasConflicts}}
