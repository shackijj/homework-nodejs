function treeNavigation (path, branch) {
  const navigation = [];
  path
    .split('/')
    .filter(item => item !== '')
    .forEach((dir, idx, ary) => {
      const path = (idx > 0 ? ary[idx - 1] + '/' : '')  + dir ;
      navigation.push({
        name: dir,
        href: `/tree?commit=${branch}&path=${path}`
      });
    });

  navigation.unshift({
    name: 'root',
    href: `/tree?commit=${branch}`
  });
  return navigation;
};

module.exports = treeNavigation;
