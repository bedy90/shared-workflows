const { execSync } = require('child_process');
const fs = require('fs');
const postComment = require('./github-comment-helper.cjs');

module.exports = async ({ github, context, templatePath }) => {
    let files = [];
    try {
        const output = execSync('git ls-files', { encoding: 'utf8' });
        files = output.split('\n').filter(f => f.trim() !== '');
    } catch (err) {
        console.error('Erreur lors de l\'exécution de git ls-files:', err);
        return;
    }

    const caseConflicts = [];
    const seen = new Map(); // lowercase name -> original name

    files.forEach(file => {
        const lower = file.toLowerCase();
        if (seen.has(lower)) {
            const original = seen.get(lower);
            if (original !== file) {
                caseConflicts.push({
                    file1: original,
                    file2: file
                });
            }
        } else {
            seen.set(lower, file);
        }
    });

    const data = {
        hasConflicts: caseConflicts.length > 0,
        conflicts: caseConflicts
    };

    await postComment({
        github,
        context,
        templatePath,
        data,
        identifier: '<!-- case-check-comment -->',
        defaultTemplatePath: '.github/template/case-check.md'
    });
};
