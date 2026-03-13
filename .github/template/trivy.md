<!-- trivy-comment -->
# 🔍 Scan de sécurité Trivy

{{#vulnerabilitiesFound}}
{{#results}}
### Cible : `{{Target}}`

<details>
  <summary><strong>Voir les vulnérabilités ({{Vulnerabilities.length}})</strong></summary>

| ID | Paquet | Sévérité | Version installée | Version corrigée | Titre |
|---|---|---|---|---|---|
{{#Vulnerabilities}}
| [{{VulnerabilityID}}]({{PrimaryURL}}) | {{PkgName}} | {{Severity}} | {{InstalledVersion}} | {{FixedVersion}} | {{Title}} |
{{/Vulnerabilities}}

</details>

{{/results}}
{{/vulnerabilitiesFound}}
{{^vulnerabilitiesFound}}
✅ Aucune vulnérabilité critique ou élevée détectée par Trivy.
{{/vulnerabilitiesFound}}
