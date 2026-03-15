# nazozokc Portfolio

中学生プログラマのポートフォリオサイト。GitHub Pages でホストされています。

## 技術スタック

- HTML / CSS / Vanilla JavaScript
- GitHub REST API
- marked.js

## カラースキーム（Kanagawa 風）

```
背景：#e8e4df / テキスト：#3d3d3d
緑：#5a7a4b / 青：#4a6a7a / 赤：#a85450 / 黄：#8a752a
```

## 主な機能

- ダークモード対応
- GitHub API によるリポジトリ情報表示
- ブログ機能
- Zenn 記事連携

## ブログ記事の追加方法

1. `blog/*.md` に Markdown ファイルを作成
2. `blog-index.json` に記事を追加

## ファビコンの設定方法

1. `image/` に画像ファイルを配置
2. `index.html` の `<head>` 内にある `<link rel="icon">` の `href` を変更
3. `index.css` の `.hero-profile-image` スタイルを必要に応じて調整

## ファイル構成

| ファイル | 説明 |
| --- | --- |
| index.html | メインページ（各ビュー、ヘッダー、フッター） |
| index.js | 共通 JS（GitHub API、blog 読み込み、テーマ切り替え） |
| index.css | 共通スタイル（Kanagawa 風テーマ、レスポンシブデザイン） |
| blog-index.json | ブログ記事のインデックス |
| blog/*.md | ブログ記事（Markdown） |
| image/* | 画像リソース（ファビコン、プロフィール画像） |

## License

MIT
