## CLAUDE.md 要約

### プロジェクトの概要
nazozokcのポートフォリオサイト。GitHub Pagesでホストされている。

---

### ファイル構成

| ファイル | 説明 |
|---|---|
| index.html | メインページ |
| index.js | 共通JS（GitHub API、blog読み込み） |
| index.css | 共通スタイル |
| blog-index.json | ブログ記事のインデックス |
| blog/*.md | ブログ記事（Markdown）  |

---

### 技術スタック
HTML/CSS/Vanilla JS + GitHub REST API

---

### 主な問題点

**パフォーマンス**
- GitHub APIの呼び出しが直列処理で遅い → `Promise.all()`で並列化すべき

**信頼性**
- GitHub APIトークンなし → レート制限（60req/h）に引っかかりやすい

---

### Blogの追加方法

1. `blog/*.md` にMarkdownファイルを作成
2. `blog-index.json` に記事を追加

---

### カラースキーム（Kanagawa風）

```
背景: #e8e4df / テキスト: #3d3d3d
緑: #5a7a4b / 青: #4a6a7a / 赤: #a85450 / 黄: #8a752a
```
