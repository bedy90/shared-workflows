const fs = require('fs');
const postComment = require('./github-comment-helper.cjs');

module.exports = async ({ github, context, templatePath }) => {
    const reportPath = 'eslint-report.json';

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

    await postComment({
        github,
        context,
        templatePath,
        data,
        identifier: '<!-- eslint-check-comment -->',
        defaultTemplatePath: '.github/template/eslint.md'
    });
};
