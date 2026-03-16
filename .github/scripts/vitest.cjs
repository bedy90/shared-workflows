const fs = require('fs');
const path = require('path');
const postComment = require('./github-comment-helper.cjs');

module.exports = async ({ github, context, templatePath }) => {
    const reportPath = 'vitest-report.json';
    if (!fs.existsSync(reportPath)) {
        console.log('vitest-report.json non trouvé');
        return;
    }

    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    const { numTotalTests, numPassedTests, numFailedTests, numPendingTests, testResults } = report;

    const data = {
        statusEmoji: numFailedTests > 0 ? '❌' : '✅',
        numPassedTests,
        numFailedTests,
        numPendingTests,
        numTotalTests,
        results: testResults.map(res => ({
            name: path.basename(res.name),
            status: res.status === 'passed' ? '✅' : '❌',
            passed: res.assertionResults.filter(a => a.status === 'passed').length,
            failed: res.assertionResults.filter(a => a.status === 'failed').length,
        }))
    };

    await postComment({
        github,
        context,
        templatePath,
        data,
        identifier: '<!-- vitest-comment -->',
        defaultTemplatePath: '.github/template/vitest.md'
    });
};
