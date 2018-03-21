function treeNavigation (path, branch) {
  const navigation = [];
  const dirs = path
    .split('/')
    .filter(item => item !== '')
    .forEach((dir, idx, ary) => {
      const path = (idx > 0 ? ary[idx - 1] + '/' : '')  + dir ;
      navigation.push({
        name: dir,
        href: `/tree?branch=${branch}&path=${path}`
      });
    });

  navigation.unshift({
    name: 'root',
    href: `/tree?branch=${branch}`
  });
  return navigation;
};

module.exports = treeNavigation;
