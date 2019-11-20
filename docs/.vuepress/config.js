module.exports = {
  title: 'AZHONG',
  description: '学海无涯,真香!',
  themeConfig: {
    // 1.接受字符串，它设置了最后更新时间的label，例如：最后更新时间：2019年5月3日 21:51:53
    lastUpdated: '最后更新时间',
    // 2.设置true，开启最后更新时间
    lastUpdated: true,
    // GitHub仓库地址
    repo: 'https://github.com/yuanjinzhong',
    // 自定义仓库链接文字。
    repoLabel: 'GitHub',
    //导航栏
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'Languages',
        items: [
          { text: 'Java', link: '/language/chinese' },
          { text: 'H5', link: '/language/japanese' },
          { text: 'Python', link: '/language/japanese' },
          { text: 'Go', link: '/language/japanese' }
        ]
      },
      { text: 'About', link: '/blog/about.md' }
    ],
    //侧边栏
    sidebar: [
      ['/', '首页'],
      ['/blog/java基础/static关键字.md', 'static关键字'],
      ['/blog/mybatis/mybatis.md', 'mybatis学习'],
      ['/blog/特性测试.md', '特性测试'],
      ['/blog/养猪场.md', '平安养殖场']
    ]
  }
}
