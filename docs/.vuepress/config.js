module.exports = {
  title: 'AZHONG',
  description: '学海无涯,真香!',
  themeConfig: {
    // GitHub仓库地址
    repo: 'https://github.com/yuanjinzhong',
    // 自定义仓库链接文字。
    repoLabel: 'GitHub',
    //导航栏
    nav: [
      { text: 'Home', link: '/' },
      { text: 'FirstBlog', link: '/blog/FirstBlog.md' },
      {
        text: 'Languages',
        items: [
          { text: 'Java', link: '/language/chinese' },
          { text: 'H5', link: '/language/japanese' },
          { text: 'Python', link: '/language/japanese' },
          { text: 'Go', link: '/language/japanese' }
        ]
      },
      {
        text: 'Languages3',
        items: [
          {
            text: '分组1', items: [{ text: 'Java', link: '/language/chinese' },
            { text: 'H5', link: '/language/japanese' },
            { text: 'Python', link: '/language/japanese' },
            { text: 'Go', link: '/language/japanese' }]
          },
          {
            text: '分组2', items: [{ text: 'Java', link: '/language/chinese' },
            { text: 'H5', link: '/language/japanese' },
            { text: 'Python', link: '/language/japanese' },
            { text: 'Go', link: '/language/japanese' }]
          }
        ]
      }
    ],
    //侧边栏
    sidebar: [
      ['/','首页'],
      //路径不存在的话vue会渲染报错
      ['/blog/FirstBlog.md','页面A'],
    ]
  }
}
