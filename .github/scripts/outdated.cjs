const fs = require('fs');
const postComment = require('./github-comment-helper.cjs');

module.exports = async ({ github, context, templatePath }) => {
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

  await postComment({
    github,
    context,
    templatePath,
    data: packageList,
    identifier: '<!-- outdated-comment -->',
    defaultTemplatePath: '.github/template/outdated.md'
  });
};
