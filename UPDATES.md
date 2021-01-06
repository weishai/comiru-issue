# 2021-01-07 v1.1 更新
1. LazyLoad改用原生方式
   1. getBoundingClientRect + scroll 实现
   2. 支持横向滚动
   3. 利用passive优化移动端
   4. 解决了IE 11检测Bug
2. TagInput组件修复匹配问题
   1. 解决了空字符问题
   2. 增加Loose模式，支持宽松的搜索结果
   3. 支持Backspace按键删除Tag
3. Description 3页面
   1. 利用CSS实现了content内容的多行省略显示
   2. 调整mock数据，搜索结果符合关键词
4. 更新CSS，兼容到IE 11

## Github地址
> https://github.com/weishai/comiru-issue

## 与第一版提交的Diff查看
> https://github.com/weishai/comiru-issue/compare/v1.0...v1.1
