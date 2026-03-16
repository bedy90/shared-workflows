const fs = require('fs');
const postComment = require('./github-comment-helper.cjs');

module.exports = async ({ github, context, templatePath }) => {
    const reportPath = 'trivy-report.json';
    if (!fs.existsSync(reportPath)) {
        console.log('trivy-report.json non trouvé');
        return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const results = report.Results || [];
    const targetsWithVulns = results.filter(r => r.Vulnerabilities && r.Vulnerabilities.length > 0);

    const data = {
        vulnerabilitiesFound: targetsWithVulns.length > 0,
        results: targetsWithVulns.map(r => ({
            Target: r.Target,
            Vulnerabilities: r.Vulnerabilities.map(v => ({
                VulnerabilityID: v.VulnerabilityID,
                PkgName: v.PkgName,
                Severity: v.Severity,
                InstalledVersion: v.InstalledVersion,
                FixedVersion: v.FixedVersion || 'N/A',
                Title: v.Title,
                PrimaryURL: v.PrimaryURL,
            })),
        })),
    };

    await postComment({
        github,
        context,
        templatePath,
        data,
        identifier: '<!-- trivy-comment -->',
        defaultTemplatePath: '.github/template/trivy.md'
    });
};
