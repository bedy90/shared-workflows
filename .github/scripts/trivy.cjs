const fs = require('fs');
const Mustache = require('mustache');

module.exports = async ({ github, context, templatePath }) => {
    const reportPath = 'trivy-report.json';
    if (!fs.existsSync(reportPath)) {
        console.log('trivy-report.json non trouvé');
        return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

    // Trivy JSON structure typically has a "Results" array
    const results = report.Results || [];

    // Filter targets that have vulnerabilities
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

    const IDENTIFIER = '<!-- trivy-comment -->';
    const finalTemplatePath = templatePath || '.github/template/trivy.md';
    const template = fs.readFileSync(finalTemplatePath, 'utf8');
    const message = IDENTIFIER + '\n' + Mustache.render(template, data);

    const { data: comments } = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
    });

    const commentToUpdate = comments.find(c => c.body.includes(IDENTIFIER));

    if (commentToUpdate) {
        await github.rest.issues.updateComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: commentToUpdate.id,
            body: message,
        });
    } else {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: message,
        });
    }
};
