const fs = require('fs');
const Mustache = require('mustache');

module.exports = async ({ github, context, templatePath }) => {
    const IDENTIFIER = '<!-- eslint-check-comment -->';
    const reportPath = 'eslint-report.json';
    const finalTemplatePath = templatePath || '.github/template/eslint.md';

    if (!fs.existsSync(reportPath)) {
        console.log('Aucun rapport ESLint trouvé.');
        return;
    }

    const rawReport = fs.readFileSync(reportPath, 'utf8');
    let results;
    try {
        results = JSON.parse(rawReport);
    } catch (e) {
        console.error('Erreur de parsing du rapport ESLint:', e);
        return;
    }

    let errorCount = 0;
    let warningCount = 0;
    const detail = [];

    results.forEach(file => {
        errorCount += file.errorCount;
        warningCount += file.warningCount;

        file.messages.forEach(msg => {
            if (detail.length < 50) {
                detail.push({
                    filePath: file.filePath.replace(process.cwd().replace(/\\/g, '/'), '').replace(/^\//, ''),
                    line: msg.line,
                    column: msg.column,
                    ruleId: msg.ruleId,
                    message: msg.message,
                });
            }
        });
    });

    const totalIssues = errorCount + warningCount;
    const data = {
        success: totalIssues === 0,
        errorCount,
        warningCount,
        detail,
        truncated: totalIssues > 50,
        remainingCount: totalIssues - 50,
    };

    const template = fs.readFileSync(finalTemplatePath, 'utf8');
    const message = IDENTIFIER + '\n' + Mustache.render(template, data);

    const { data: comments } = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
    });

    const existingComment = comments.find(c => c.body.includes(IDENTIFIER));

    if (existingComment) {
        await github.rest.issues.updateComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: existingComment.id,
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
