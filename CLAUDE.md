# 最初にやること
`/home/nazozokc/agents/AGENTS.md`
- 上のファイルをしっかり読み込んであなたがタスクを実行する際にしっかり参考にしてください。

## CLAUDE.md 要約

### プロジェクトの概要
nazozokcのポートフォリオサイト。**Linuxターミナル風のUI**を持つ単一HTMLファイルのWebアプリ。

---

### 技術スタック
HTML/CSS/Vanilla JS + GitHub REST API + Marked.js（未使用）

---

### コマンド一覧

| コマンド | 内容 |
|---|---|
| `neovim` | Neovim設定を表示（静的） |
| `nix` | Nix/Home Manager設定を表示（静的） |
| `wezterm` | WezTerm設定を表示（静的） |
| `X` | X(Twitter)プロフィールへリンク |
| `github` | GitHub APIからライブデータ取得・表示 |
| `:q` | ターミナルをリセット |
| `clear` | 出力をクリア |

---

### 主な問題点

**パフォーマンス**
- GitHub APIの呼び出しが直列処理で遅い → `Promise.all()`で並列化すべき
- キャッシュなしで毎回APIを叩く → `localStorage`に保存すべき
- Marked.jsを読み込んでるのに使ってない → 削除すべき

**信頼性**
- GitHub APIトークンなし → レート制限（60req/h）に引っかかりやすい
- エラーメッセージが雑 → 具体的なエラー（レート制限 or ネットワークエラー）を出すべき

**UX**
- `displayBackTop()`が定義されてるのに呼ばれていない
- コマンド履歴や補完なし

---

### よくある変更パターン

**新コマンド追加の手順**
1. HTMLにボタン追加
2. `executeCommand()`のswitchにcase追加
3. ハンドラー関数を実装

**色の変更** → `:root`のCSS変数を編集するだけ

---

### カラースキーム（Kanagawa風）

```
背景: #0d0c0c / テキスト: #c5c9c5
緑: #8a9a7b / 青: #8ba4b0 / 赤: #c4746e / 黄: #c4b28a
```
