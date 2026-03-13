<!-- audit-comment -->

# Rapport d'audit de vulnérabilités

{{#noVulnerabilities}}
✅ **Aucune vulnérabilité trouvée !** Votre projet est en bonne santé sécurité.
{{/noVulnerabilities}}

{{#grouped}}
### {{severity}}

<details>
  <summary><strong>Voir les détails ({{vulnerabilities.length}} vulnérabilités)</strong></summary>

| Nom du paquet | Dépendance | Titre | CWE | CVSS | Versions affectées | Lien |
|--------------|------------|-------|-----|------|--------------------|------|
{{#vulnerabilities}}
| {{name}} | {{dependency}} | {{title}} | {{cwe}} | {{cvss}} | {{range}} | [Details]({{url}}) |
{{/vulnerabilities}}

</details>

{{/grouped}}
