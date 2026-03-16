const fs = require('fs');
const postComment = require('./github-comment-helper.cjs');

function groupBySeverity(vulnerabilities) {
  const severities = {
    Critical: [],
    High: [],
    Moderate: [],
    Low: [],
  };

  vulnerabilities.forEach(vuln => {
    const severityRaw = vuln.severity || (vuln.cvss_score ? (
      vuln.cvss_score >= 9 ? 'critical' :
        vuln.cvss_score >= 7 ? 'high' :
          vuln.cvss_score >= 4 ? 'moderate' : 'low'
    ) : 'low');

    let severity;

    switch (severityRaw.toString().toLowerCase()) {
      case 'critical':
        severity = 'Critical';
        break;
      case 'high':
        severity = 'High';
        break;
      case 'moderate':
        severity = 'Moderate';
        break;
      case 'low':
      default:
        severity = 'Low';
        break;
    }

    severities[severity].push({
      name: vuln.package_name,
      dependency: vuln.dependency_name || '',
      title: vuln.title || '',
      cwe: vuln.cwe || '',
      cvss: vuln.cvss?.score !== undefined ? vuln.cvss.score : vuln.cvss_score,
      range: vuln.vulnerable_versions || '',
      url: vuln.url || '',
      severity: severityRaw,
    });
  });

  return severities;
}

function extractVulnerabilities(vulnerabilitiesObj) {
  const allVulns = [];

  Object.values(vulnerabilitiesObj).forEach(pkg => {
    const viaArr = Array.isArray(pkg.via) ? pkg.via : [pkg.via];

    viaArr.forEach(vuln => {
      if (typeof vuln === 'object' && vuln !== null) {
        allVulns.push({
          package_name: vuln.name || pkg.name,
          dependency_name: pkg.name,
          title: vuln.title || '',
          cwe: (vuln.cwe && Array.isArray(vuln.cwe)) ? vuln.cwe.join(', ') : '',
          cvss: vuln.cvss,
          cvss_score: vuln.cvss?.score ?? 0,
          vulnerable_versions: vuln.range || pkg.range || '',
          severity: vuln.severity || pkg.severity || 'low',
          url: vuln.url || '',
        });
      }
    });
  });

  return allVulns;
}

module.exports = async ({ github, context, templatePath }) => {
  if (!fs.existsSync('audit-result.json')) {
    console.log('audit-result.json not found');
    return;
  }
  const auditRaw = fs.readFileSync('audit-result.json', 'utf8');
  if (!auditRaw || auditRaw.trim() === '') {
    console.log('audit-result.json is empty');
    return;
  }
  const auditData = JSON.parse(auditRaw);

  const vulnerabilitiesRaw = auditData.vulnerabilities || {};
  const noVulnerabilities = Object.keys(vulnerabilitiesRaw).length === 0;

  let groupedArray = [];
  if (!noVulnerabilities) {
    const vulnerabilitiesDetailed = extractVulnerabilities(vulnerabilitiesRaw);
    const grouped = groupBySeverity(vulnerabilitiesDetailed);

    groupedArray = [
      { severity: 'Critique', vulnerabilities: grouped.Critical },
      { severity: 'Élevée', vulnerabilities: grouped.High },
      { severity: 'Modérée', vulnerabilities: grouped.Moderate },
      { severity: 'Faible', vulnerabilities: grouped.Low },
    ].filter(g => g.vulnerabilities.length > 0);
  }

  await postComment({
    github,
    context,
    templatePath,
    data: {
      grouped: groupedArray,
      noVulnerabilities: noVulnerabilities,
    },
    identifier: '<!-- audit-comment -->',
    defaultTemplatePath: '.github/template/audit.md'
  });
};
