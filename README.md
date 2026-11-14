# nazozokc Portfolio

中学生プログラマのポートフォリオサイト。SvelteKit + GitHub Pages でホスト。

## 技術スタック

- Svelte 5 (runes: `$state`, `$derived`, `$effect`)
- SvelteKit 2 + `@sveltejs/adapter-static`
- TypeScript
- カスタムCSS (Kanagawa風テーマ、glassmorphism)
- GitHub REST API
- Zenn API
- marked (ビルド時のみ)

## カラースキーム (Kanagawa風)

```
背景: #e8e4df / テキスト: #3d3d3d
緑: #5a7a4b / 青: #4a6a7a / 赤: #a85450 / 黄: #8a752a
```

## 主な機能

- ダークモード対応 (localStorage永続化)
- GitHub API によるリポジトリ情報表示
- ブログ機能 (ビルド時markdown→HTMLプリレンダリング)
- Zenn 記事連携 (クライアントサイドfetch)

## 開発

```bash
npm run dev      # 開発サーバー
npm run build    # 本番ビルド (static adapter → build/)
npm run preview  # ビルド成果物のプレビュー
```

## ブログ記事の追加方法

1. `blog/*.md` にMarkdownファイルを作成 (frontmatter付き)
2. `static/blog-manifest.json` の `posts` 配列にslugを追加

## ファイル構成

| ファイル/ディレクトリ | 説明 |
|---|---|
| `src/routes/` | SvelteKitルート、ページコンポーネント |
| `src/lib/components/` | 共通コンポーネント |
| `src/lib/utils/` | GitHub/Zenn APIクライアント、キャッシュ |
| `src/lib/data/` | 静的データ (skills, interests, timeline) |
| `src/lib/theme.ts` | テーマ管理 (day/night) Svelte store |
| `src/app.css` | グローバルCSS (Kanagawaテーマ) |
| `static/` | 静的アセット (画像, blog-manifest.json) |
| `blog/*.md` | ブログ記事 (Markdown) |
| `image/` | 画像リソース (プロジェクトルートに維持) |
| `.github/workflows/deploy.yml` | GitHub Actions デプロイ設定 |

## License

MIT
