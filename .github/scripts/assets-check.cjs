const fs = require('fs');
const path = require('path');
const postComment = require('./github-comment-helper.cjs');

const ASSETS_ROOT = 'src/assets';
const SOURCE_ROOT = 'src';
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

module.exports = async ({ github, context, templatePath }) => {
    const heavyAssets = [];
    const brokenReferences = [];

    // 1. Vérifier le poids des assets
    function checkAssetsWeight(dir) {
        if (!fs.existsSync(dir)) return;
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                checkAssetsWeight(fullPath);
            } else {
                if (stat.size > MAX_SIZE_BYTES) {
                    heavyAssets.push({
                        name: fullPath.replace(/\\/g, '/'),
                        size: (stat.size / (1024 * 1024)).toFixed(2) + ' Mo'
                    });
                }
            }
        });
    }

    checkAssetsWeight(ASSETS_ROOT);

    // 2. Vérifier les références dans le code
    const assetExtensions = [
        '.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico', '.pdf',
        '.avif', '.apng',
        '.mp4', '.webm', '.ogv', '.mp3', '.wav', '.ogg',
        '.woff', '.woff2', '.ttf', '.otf', '.eot'
    ];

    function scanFiles(dir) {
        if (!fs.existsSync(dir)) return;
        const items = fs.readdirSync(dir);
        items.forEach(item => {
            const fullPath = path.join(dir, item);
            if (fs.statSync(fullPath).isDirectory()) {
                if (item !== 'assets' && item !== 'node_modules') {
                    scanFiles(fullPath);
                }
            } else {
                const ext = path.extname(fullPath).toLowerCase();
                if (['.ts', '.html', '.css', '.scss'].includes(ext)) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const regex = /(?:["'`]|url\(['"]?)(?:\/)?(assets\/[^"'`)]+)(?:["'`]|\)?)/g;
                    let match;
                    while ((match = regex.exec(content)) !== null) {
                        const assetRef = match[1];
                        const assetExt = path.extname(assetRef).toLowerCase();
                        if (assetExtensions.includes(assetExt)) {
                            const fullAssetPath = path.join('src', assetRef);
                            if (!fs.existsSync(fullAssetPath)) {
                                brokenReferences.push({
                                    source: fullPath.replace(/\\/g, '/'),
                                    reference: assetRef
                                });
                            }
                        }
                    }
                }
            }
        });
    }

    scanFiles(SOURCE_ROOT);

    const data = {
        hasIssues: heavyAssets.length > 0 || brokenReferences.length > 0,
        hasHeavyAssets: heavyAssets.length > 0,
        heavyAssets: heavyAssets,
        hasBrokenReferences: brokenReferences.length > 0,
        brokenReferences: brokenReferences
    };

    await postComment({
        github,
        context,
        templatePath,
        data,
        identifier: '<!-- assets-check-comment -->',
        defaultTemplatePath: '.github/template/assets.md'
    });
};
