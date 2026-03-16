### {{statusEmoji}} Résultats des tests Vitest

**{{numPassedTests}} SUCCÈS** - **{{numFailedTests}} ÉCHECS**{{#numPendingTests}} - **{{numPendingTests}} EN ATTENTE**{{/numPendingTests}} (Total: {{numTotalTests}})

<details>
<summary>Détails des tests</summary>

| Suite de tests | Statut | Passés | Échecs |
|---|---|---|---|
{{#results}}
| {{name}} | {{status}} | {{passed}} | {{failed}} |
{{/results}}

</details>
