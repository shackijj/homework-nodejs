function treeNavigation (path, branch) {
  const navigation = [];
  path
    .split('/')
    .filter(item => item !== '')
    .forEach((dir, idx, ary) => {
      let path;
      if (idx === 0) {
        path = dir;
      } else {
        path = ary.slice(0, idx + 1).join('/');
      }

      navigation.push({
        name: dir,
        href: `/tree?commit=${branch}&path=${path}`
      });
    });

  if (navigation.length > 0) {
    navigation.unshift({
      name: 'root',
      href: `/tree?commit=${branch}`
    });
  }
  return navigation;
};

module.exports = treeNavigation;
