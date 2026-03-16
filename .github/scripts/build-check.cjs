const fs = require('fs');
const postComment = require('./github-comment-helper.cjs');

module.exports = async ({ github, context, templatePath }) => {
    const logPath = 'build-output.log';
    if (!fs.existsSync(logPath)) {
        console.log('build-output.log non trouvé');
        return;
    }

    const output = fs.readFileSync(logPath, 'utf8');

    // 1. Extraire les avertissements (Warnings)
    const warnings = [];
    const lines = output.split('\n');
    lines.forEach(line => {
        if (line.toLowerCase().includes('warning:') || line.toLowerCase().includes('exceeded maximum budget')) {
            const cleanLine = line.replace(/\u001b\[[0-9;]*m/g, '').trim();
            if (cleanLine && !warnings.includes(cleanLine)) {
                warnings.push(cleanLine);
            }
        }
    });

    // 2. Extraire les tailles de bundle
    const bundles = [];
    lines.forEach(line => {
        const cleanLine = line.replace(/\u001b\[[0-9;]*m/g, '').trim();

        if (cleanLine.includes('|') && (cleanLine.includes('kB') || cleanLine.includes('MB'))) {
            const parts = cleanLine.split('|').map(p => p.trim());
            if (parts.length >= 3) {
                bundles.push({
                    name: parts[1],
                    size: parts[2]
                });
            }
        }
        else if ((cleanLine.includes('kB') || cleanLine.includes('MB')) && cleanLine.includes('(')) {
            const matchSmall = cleanLine.match(/^(.+?)\s*\((.+?)\)$/);
            if (matchSmall) {
                bundles.push({
                    name: matchSmall[1].trim(),
                    size: matchSmall[2].trim()
                });
            }
        }
    });

    const data = {
        hasWarnings: warnings.length > 0,
        warnings: warnings,
        bundles: bundles,
        hasBundles: bundles.length > 0
    };

    await postComment({
        github,
        context,
        templatePath,
        data,
        identifier: '<!-- build-check-comment -->',
        defaultTemplatePath: '.github/template/build.md'
    });
};
