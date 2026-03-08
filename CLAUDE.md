# 最初にやること
`~/.agents/AGENTS.md`
- 上のファイルをしっかり読み込んであなたがタスクを実行する際にしっかり参考にしてください。

## CLAUDE.md 要約

### プロジェクトの概要
nazozokcのポートフォリオサイト。GitHub Pagesでホストされている。

---

### ファイル構成

| ファイル | 説明 |
|---|---|
| index.html | メインページ（各ビュー、ヘッダー、フッター） |
| index.js | 共通JS（GitHub API、blog読み込み、テーマ切り替え） |
| index.css | 共通スタイル（Kanagawa風テーマ、レスポンシブデザイン） |
| blog-index.json | ブログ記事のインデックス |
| blog/*.md | ブログ記事（Markdown） |
| image/* | 画像リソース（ファビコン、プロフィール画像） |

---

### 技術スタック
HTML/CSS/Vanilla JS + GitHub REST API + marked.js

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

### ファビコンの設定方法

1. `image/` に画像ファイルを配置
2. `index.html` の `<head>` 内にある `<link rel="icon">` の `href` を変更
3. `index.css` の `.hero-profile-image` スタイルを必要に応じて調整

---

### カラースキーム（Kanagawa風）

```
背景: #e8e4df / テキスト: #3d3d3d
緑: #5a7a4b / 青: #4a6a7a / 赤: #a85450 / 黄: #8a752a
```
