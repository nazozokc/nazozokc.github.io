# AGENTS.md

このファイルは、このリポジトリで作業するAIエージェント向けのガイドラインです。

## プロジェクト概要

個人のポートフォリオサイト。ターミナル風のUIを持つ静的Webサイト。
バックエンドなし、ビルドプロセスなしのシンプルな構成。

## ビルド・開発コマンド

### ローカルサーバー起動

```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# または任意の静的ファイルサーバーを使用
```

### 本番デプロイ

静的ファイルとして直接デプロイ（GitHub Pages, Netlify, Vercel等）

### テスト・Lint

現在、テストフレームワークとリンターは導入されていません。
コードの変更後は、ローカルサーバーで動作確認してください。

## ファイル構成

```
/
├── main.html      # メインHTMLファイル
├── main.css       # スタイルシート
├── main.js        # JavaScript（ターミナルロジック）
└── blog/
    ├── index.json # ブログ記事のメタデータ
    └── *.md       # Markdown形式のブログ記事
```

## コードスタイルガイドライン

### 全般

- **インデント**: 2スペース
- **文字エンコーディング**: UTF-8
- **言語**: 日本語コンテンツ（HTMLのlang属性は`ja`）

### HTML

- DOCTYPE宣言を含める
- 日本語コンテンツのため`<html lang="ja">`を設定
- セマンティックなHTML要素を使用
- 外部ライブラリはCDNから読み込み（例: marked.js）

### CSS

```css
/* CSSカスタムプロパティを活用 */
:root {
  --bg: #0d0c0c;
  --fg: #c5c9c5;
  --green: #8a9a7b;
}

/* クラス命名規則 */
/* コンポーネント名 + 要素名 */
.top-bar { }
.top-bar-inner { }
.top-bar-title { }

/* 状態・バリアント */
.repo-item { }
.repo-item:hover { }
```

- CSSカスタムプロパティでカラースキームを管理
- BEMライクなクラス命名（コンポーネント名 + 要素名）
- アニメーションは`@keyframes`で定義
- `cubic-bezier`でスムーズなトランジション
- `backdrop-filter`でガラス効果

### JavaScript

```javascript
// 変数宣言
let terminal, cmdInput;

// 関数定義: アロー関数またはfunction宣言
document.addEventListener('DOMContentLoaded', () => { });
function sleep(ms) { }

// 非同期処理: async/awaitを使用
async function handleBlog() {
  const response = await fetch('./blog/index.json');
  const posts = await response.json();
}

// エラーハンドリング: try-catch
try {
  // 処理
} catch (err) {
  console.error(err);
}

// 文字列: シングルクォート使用
createOutputLine('<span class="accent">text</span>');

// DOM操作: innerHTMLでHTML挿入
element.innerHTML = content;
```

- **命名規則**: camelCase（変数・関数）
- **文字列**: シングルクォート推奨
- **非同期**: async/awaitパターン
- **DOM操作**: `document.createElement()`と`innerHTML`を適材適所で使い分け
- **イベントハンドラ**: `addEventListener`を使用

### Markdown (ブログ記事)

```markdown
---
title: "記事タイトル"
emoji: "🐥"
type: "tech"  # tech / idea
topics: [WezTerm, lua, CLI]
published: true
---

# 見出し

本文...
```

- YAMLフロントマターを必ず含める
- フィールド: title, emoji, type, topics, published
- 見出しは`#`で記述
- リンクは`https://example.com/`形式で記述

## ターミナルコマンド実装

新しいコマンドを追加する場合:

1. `main.js`の`executeCommand()`関数にcaseを追加
2. ハンドラー関数を作成（例: `handleNewCommand()`）
3. `main.html`のクリックコマンドリストに追加
4. 必要に応じてCSSスタイルを追加

```javascript
case "newcmd":
  await handleNewCommand();
  break;
```

## セキュリティ考慮事項

- ユーザー入力は必ず`escapeHtml()`でエスケープ
- 外部API（GitHub API）のエラーハンドリングを忘れない
- 機密情報はクライアントサイドにハードコードしない

## カラースキーム

kanagawaテーマベース:
- 背景: `#0d0c0c` (dark)
- 前景: `#c5c9c5` (light gray)
- 緑: `#8a9a7b`
- 青: `#8ba4b0`
- 赤: `#c4746e`
- 黄: `#c4b28a`
- 紫: `#a292a3`

## 注意事項

- このプロジェクトにビルドツールはありません
- TypeScriptやESLint等の設定は存在しません
- コード変更後はブラウザで実際に動作確認してください
- 新しい機能追加時は既存のコードスタイルに合わせてください
