const fs = require('fs');
const Mustache = require('mustache');

/**
 * Aide à la gestion des commentaires GitHub sur les Pull Requests.
 * Permet d'éviter la duplication de code dans les scripts d'analyse.
 */
module.exports = async ({ github, context, templatePath, data, identifier, defaultTemplatePath }) => {
    const finalTemplatePath = templatePath || defaultTemplatePath;
    
    if (!fs.existsSync(finalTemplatePath)) {
        console.error(`Template non trouvé : ${finalTemplatePath}`);
        return;
    }

    const template = fs.readFileSync(finalTemplatePath, 'utf8');
    const message = identifier + '\n' + Mustache.render(template, data);

    const { data: comments } = await github.rest.issues.listComments({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number,
    });

    const commentToUpdate = comments.find(c => c.body.includes(identifier));

    if (commentToUpdate) {
        await github.rest.issues.updateComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            comment_id: commentToUpdate.id,
            body: message
        });
        console.log(`Commentaire mis à jour (${identifier})`);
    } else {
        await github.rest.issues.createComment({
            owner: context.repo.owner,
            repo: context.repo.repo,
            issue_number: context.issue.number,
            body: message
        });
        console.log(`Nouveau commentaire créé (${identifier})`);
    }
};
