<!-- outdated-comment -->
# 📦 Dépendances obsolètes

Ce rapport détaille les dépendances obsolètes trouvées dans le projet.

{{^noOutdated}}
<details>
  <summary><strong>Types de versions</strong></summary>

- `Actuelle (current)`: Version actuellement installée.
- `Voulue (wanted)`: Version spécifiée dans `package.json`.
- `Dernière (latest)`: Dernière version disponible sur npm.

</details>
{{/noOutdated}}

{{#noOutdated}}
✅ **Toutes les dépendances sont à jour !** Félicitations pour la maintenance du projet.
{{/noOutdated}}

{{^noOutdated}}
### Liste des dépendances

<details>
  <summary><strong>Afficher les dépendances obsolètes</strong></summary>

| Nom du paquet | Actuelle | Voulue | Dernière | Type |
|---|---|---|---|---|
{{#data}}
| {{name}} | {{current}} | {{wanted}} | {{latest}} | {{{changeType}}} |
{{/data}}

</details>

---
💡 *Pensez à mettre à jour ces dépendances pour bénéficier des dernières corrections et fonctionnalités.*
{{/noOutdated}}