// outdated.cjs
const fs = require('fs');
const Mustache = require('mustache');

module.exports = async ({ github, context, templatePath }) => {
  // Lire et parser le JSON généré par npm outdated
  if (!fs.existsSync('outdated.json')) {
    console.log('outdated.json not found');
    return;
  }
  const outdatedRaw = fs.readFileSync('outdated.json', 'utf8');
  if (!outdatedRaw || outdatedRaw.trim() === '') {
    console.log('outdated.json is empty');
    return;
  }
  const result = JSON.parse(outdatedRaw);
  const noOutdated = Object.keys(result).length === 0;

  // Préparer les données pour le template
  const packageList = {
    data: [],
    noOutdated: noOutdated,
  };

  if (!noOutdated) {
    function getChangeType(current, latest) {
      if (!current || !latest) return 'Unknown';
      const curr = current.split('.');
      const late = latest.split('.');
      if (curr[0] !== late[0]) return '🔴 Major';
      if (curr[1] !== late[1]) return '🟠 Minor';
      if (curr[2] !== late[2]) return '🟡 Patch';
      return '🟢 Up to date';
    }

    Object.keys(result).forEach(depName => {
      const depInfo = result[depName];
      packageList.data.push({
        name: depName,
        current: depInfo.current,
        wanted: depInfo.wanted,
        latest: depInfo.latest,
        changeType: getChangeType(depInfo.current, depInfo.latest),
      });
    });
  }

  // Lire le template Mustache externe
  const finalTemplatePath = templatePath || '.github/template/outdated.md';
  const templateFile = fs.readFileSync(finalTemplatePath, 'utf8');

  const IDENTIFIER = '<!-- outdated-comment -->';
  const commentBody = IDENTIFIER + '\n' + Mustache.render(templateFile, packageList);

  // Trouver un commentaire existant du bot
  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.issue.number,
  });

  // On cherche par IDENTIFIER sans se limiter au type 'Bot' qui peut varier
  const commentToUpdate = comments.find(c => c.body.includes(IDENTIFIER));

  // Créer ou mettre à jour le commentaire
  if (commentToUpdate) {
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: commentToUpdate.id,
      body: commentBody,
    });
  } else {
    // On ne crée le commentaire que s'il y a des packages obsolètes
    // ou si on veut toujours un message de succès (optionnel)
    // Ici, on le crée toujours pour confirmer que l'analyse est passée.
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.issue.number,
      body: commentBody,
    });
  }
};
