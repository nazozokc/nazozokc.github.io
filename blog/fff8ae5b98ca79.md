---
title: "neovimのディストリビューション「NazoVim」を作った話" 
emoji: "✨"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [neovim, Lazy, dotfiles, config, nix]
published: true
---

## なぜ作ろうと思ったのか
なぜ作ろうと思ったかというと、自分の設定ファイルが出来上がってきたかなって思ったからです。AIと一緒にneovimの設定をしていたのですが、このうちの思想が詰まった設定ファイルディストロにして公開したら面白そうじゃね？と思ったからです。
いまさら感あるかもしれませんが、この記事に最後までお付き合いいただけたら幸いです。

## NazoVimの使い方
NazoVimはneovimのディストロもどきです。プラグインマネージャーはLazy.nvimを使っています。

![](https://storage.googleapis.com/zenn-user-upload/68dfbf1e2efa-20260318.png)

### インストール方法
#### 方法１ nixの環境で試しに使ってみる
このneovimディストロはnixを使って、本来の設定を汚さずに、NazoVimを試しに使ってみることができます。
```bash
nix run github:nazozokc/NazoVim
```

#### 方法２ 本気でこのディストロを使う
本気でこのディストロを使う場合はgit cloneを使用します。

```bash
mv ~/.config/nvim ~/.config/nvim.backup  # バックアップ（任意）
git clone https://github.com/nazozokc/NazoVim ~/.config/nvim
nvim
```

### ディレクトリ構成
```
.
├── flake.nix             # Nix flake (nix run / nix develop)
├── init.lua              # エントリーポイント・キーマップ定義
├── lazy-lock.json        # プラグインバージョンロック
├── lua/
│   ├── vim-options.lua   # 基本vim設定
│   ├── plugins.lua       # lazy.nvim エントリ (空 = plugins/ 以下を自動読み込み)
│   └── plugins/          # プラグイン設定 (1ファイル1プラグイン)
├── template/             # ファイルテンプレート
│   ├── js/
│   ├── ts/
│   ├── lua/
│   ├── md/
│   └── project/
└── .github/
    ├── workflows/        # CI (nvim startup check / auto-merge)
    └── ISSUE_TEMPLATE/   # Bug report / Feature request / Plugin proposal
```

### キーバインディング
NazoVimのキーバインディングは以下のようになっています。

`<Leader>` = `Space`


:::details 基本操作
| キー | 動作 |
|------|------|
| `<Leader>h` | 検索ハイライト解除 |
| `<Leader>z` | Zen Mode |
| `<Leader>f` | バッファをフォーマット (conform.nvim) |
| `<Leader>T` | 日本語に翻訳 (n/v) |
| `<Leader>ob` | ブラウザで開く |
:::


:::details ファイル・バッファ
| キー | 動作 |
|------|------|
| `<Leader><Leader>` | ファイル検索 (snacks Picker) |
| `<Leader>g` | Live Grep |
| `<Leader>b` | バッファ一覧 |
| `<Leader>r` | 最近使ったファイル |
| `<C-p>` | ファイル検索 (Telescope) |
| `<Leader>fg` | Live Grep (Telescope) |
| `<Leader>m` | Oil ファイルエクスプローラー |
| `<Leader>n` | Neo-tree (右側) |
| `<Leader>bf` | Neo-tree (バッファ・フロート) |
| `<Leader>c` | dotfiles を Oil で開く |

**Oil 内キーマップ**

| キー | 動作 |
|------|------|
| `<CR>` | 開く |
| `-` / `<BS>` | 親ディレクトリへ |
| `<C-p>` | プレビュー |
| `<C-s>` | 縦分割で開く |
| `<C-h>` | 横分割で開く |
| `<C-t>` | タブで開く |
| `<C-l>` | 更新 |
| `g.` | 隠しファイル切替 |
| `<Esc>` | 閉じる |
| `?` | ヘルプ表示 |
:::


:::details バッファ操作
| キー | 動作 |
|------|------|
| `<C-PageDown>` | 次のバッファ |
| `<C-PageUp>` | 前のバッファ |
| `<C-A-Tab>` | 次のバッファ |
| `<C-A-S-Tab>` | 前のバッファ |
| `<C-t>` | 新規バッファ |
| `<C-q>` | バッファを閉じる |
| `<C-A-Space>` | バッファを選択 (BufferPick) |
| `<ScrollWheelUp>` | 前のバッファ |
| `<ScrollWheelDown>` | 次のバッファ |
:::


:::details ウィンドウ移動
| キー | 動作 |
|------|------|
| `<C-h>` | 左ウィンドウへ (tmux対応) |
| `<C-j>` | 下ウィンドウへ (tmux対応) |
| `<C-k>` | 上ウィンドウへ (tmux対応) |
| `<C-l>` | 右ウィンドウへ (tmux対応) |
:::


:::details LSP
| キー | 動作 |
|------|------|
| `K` | ホバー |
| `gd` | 定義へ移動 (Lspsaga) |
| `ga` | コードアクション (Lspsaga) |
| `<Leader>ca` | コードアクション (preview) |
| `<Leader>gd` | 定義へ移動 (vim.lsp) |
| `<Leader>gr` | 参照一覧 |
| `<Leader>gf` | バッファフォーマット (none-ls) |
| `<Leader>oi` | Import 整理 (TypeScript) |
| `<Leader>ru` | 未使用削除 (TypeScript) |
| `<Leader>;` | Dropbar シンボル選択 |
| `gp` | Dropbar 開く |

**診断 (Trouble)**

| キー | 動作 |
|------|------|
| `<Leader>xx` | 診断一覧 toggle |
| `<Leader>xX` | バッファの診断一覧 |
| `<Leader>cs` | シンボル一覧 |
| `<Leader>cl` | LSP 一覧 |
| `<Leader>so` | Aerial シンボルアウトライン |
| `<Leader>e` | Trouble toggle |
:::


:::details Git
| キー | 動作 |
|------|------|
| `<Leader>gd` | DiffviewOpen |
| `<Leader>gh` | ファイル履歴 |
| `<Leader>gH` | ブランチ履歴 |
| `<Leader>gc` | Diffview Close |
| `<Leader>gp` | Hunk プレビュー |
| `<Leader>gt` | Blame toggle |

**Diffview コンフリクト解消**

| キー | 動作 |
|------|------|
| `<Leader>co` | OURS を選択 |
| `<Leader>ct` | THEIRS を選択 |
| `<Leader>ca` | ALL を選択 |
| `dx` | コンフリクト削除 |

**GitHub (octo.nvim)**

| キー | 動作 |
|------|------|
| `<Leader>oi` | Issue 一覧 |
| `<Leader>op` | PR 一覧 |
| `<Leader>od` | Discussion 一覧 |
| `<Leader>on` | Notification 一覧 |
| `<Leader>os` | GitHub 検索 |
:::


:::details AI
**Claude Code**

| キー | 動作 |
|------|------|
| `<Leader>ac` | Claude Code toggle |
| `<Leader>af` | Claude Code フォーカス |
| `<Leader>ar` | Claude Code resume |
| `<Leader>aC` | Claude Code continue |
| `<Leader>am` | モデル選択 |
| `<Leader>ab` | 現在バッファを追加 |
| `<Leader>as` | 選択範囲を送信 (visual) |
| `<Leader>aa` | diff を Accept |
| `<Leader>ad` | diff を Deny |

**opencode**

| キー | 動作 |
|------|------|
| `<C-a>` | opencode に質問 (n/x) |
| `<C-x>` | opencode アクション選択 (n/x) |
| `<C-.>` | opencode toggle (n/t) |
| `go` | 範囲を opencode に追加 (operator) |
| `goo` | 行を opencode に追加 |
| `<S-C-u>` | opencode 半ページ上 |
| `<S-C-d>` | opencode 半ページ下 |
:::


:::details エディタ
**ジャンプ (flash.nvim)**

| キー | 動作 |
|------|------|
| `<CR>` | Flash ジャンプ (n/x/o) |
| `<S-CR>` | Flash Treesitter (n/x/o) |

**ワード移動 (nvim-spider)**

| キー | 動作 |
|------|------|
| `w` | 次の単語 (CamelCase/snake_case 対応) |
| `e` | 単語末尾 |
| `b` | 前の単語 |
| `ge` | 前の単語末尾 |

**Surround (mini.surround)**

| キー | 動作 |
|------|------|
| `sa` | surround 追加 |
| `sd` | surround 削除 |
| `sr` | surround 置換 |
| `sn` | n_lines 更新 |

**置換 (substitute.nvim)**

| キー | 動作 |
|------|------|
| `s` | substitute operator (n) |
| `ss` | 行を substitute (n) |
| `S` | 行末まで substitute (n) |
| `s` | ビジュアル選択を substitute (x) |

**Treesitter Textobjects**

| キー | 動作 |
|------|------|
| `af` / `if` | outer / inner 関数 |
| `ac` / `ic` | outer / inner クラス |
| `aa` / `ia` | outer / inner 引数 |
| `ai` / `ii` | outer / inner 条件分岐 |
| `al` / `il` | outer / inner ループ |
| `ab` / `ib` | outer / inner ブロック |
| `]f` / `[f` | 次/前の関数へ |
| `]c` / `[c` | 次/前のクラスへ |
| `]a` / `[a` | 次/前の引数へ |
| `]F` / `[F` | 次/前の関数末尾へ |
| `]C` / `[C` | 次/前のクラス末尾へ |
| `<Leader>sn` | 次の引数と swap |
| `<Leader>sp` | 前の引数と swap |

**検索 (hlslens + kensaku)**

| キー | 動作 |
|------|------|
| `n` | 次の検索結果 + カウント表示 |
| `N` | 前の検索結果 + カウント表示 |
| `*` | カーソル下ワード検索 |
| `#` | カーソル下ワード逆検索 |
| `<Leader>l` | virtual text toggle |
| `/` (cmdline) | kensaku 前方検索 (日本語対応) |
| `?` (cmdline) | kensaku 後方検索 (日本語対応) |
:::


:::details デバッグ (DAP)
| キー | 動作 |
|------|------|
| `<F5>` | 実行 / 継続 |
| `<F10>` | ステップオーバー |
| `<F11>` | ステップイン |
| `<F12>` | ステップアウト |
| `<Leader>db` | ブレークポイント切替 |
| `<Leader>B` | 条件付きブレークポイント |
| `<Leader>du` | DAP UI toggle |
:::


:::details テスト (neotest)
| キー | 動作 |
|------|------|
| `<Leader>tr` | 最寄りのテスト実行 |
| `<Leader>tR` | 全テスト実行 |
| `<Leader>tf` | ファイルのテスト実行 |
| `<Leader>to` | テスト出力 toggle |
:::


:::details セッション (persistence.nvim)
| キー | 動作 |
|------|------|
| `<Leader>qs` | セッション復元 |
| `<Leader>qS` | セッション選択 |
| `<Leader>ql` | 最後のセッションを復元 |
| `<Leader>qd` | セッション保存を停止 |
:::


:::details ターミナル
| キー | 動作 |
|------|------|
| `<Leader>t` | フローティングターミナル toggle |
:::


:::details Web 開発
**REST クライアント (kulala.nvim)**

| キー | 動作 |
|------|------|
| `<Leader>Rs` | リクエスト送信 |
| `<Leader>Ra` | 全リクエスト送信 |
| `<Leader>Rb` | スクラッチパッドを開く |

**package.json (package-info.nvim)**

| キー | 動作 |
|------|------|
| `<Leader>ns` | パッケージバージョン表示 |
| `<Leader>nc` | パッケージバージョン非表示 |
| `<Leader>nt` | パッケージバージョン toggle |
| `<Leader>nu` | パッケージ更新 |
| `<Leader>nd` | パッケージ削除 |
| `<Leader>ni` | パッケージ新規インストール |
| `<Leader>np` | パッケージバージョン変更 |

**Emmet**

| キー | 動作 |
|------|------|
| `<C-e>` | Emmet トリガー |
:::


:::details Rust (rust-tools.nvim)
| キー | 動作 |
|------|------|
| `<Leader>rr` | Rust Runnables |
| `<Leader>rd` | Rust Debuggables |
| `<Leader>th` | Inlay Hints toggle |
:::

### プラグイン
設定されているプラグインは以下です。

:::details LSP / 補完
| プラグイン | 用途 |
|------------|------|
| nvim-lspconfig + mason | LSP管理 |
| typescript-tools.nvim | TypeScript専用LSP（高速化設定済み） |
| nvim-cmp | 補完エンジン |
| LuaSnip + denippet.vim | スニペット（VSCode互換） |
| lspsaga.nvim | LSP UI拡張 |
| actions-preview.nvim | コードアクションプレビュー |
| conform.nvim | フォーマッター（stylua / prettier等） |
| none-ls.nvim | rubocop等の追加診断 |
| fidget.nvim | LSPプログレス表示 |
| tiny-inline-diagnostic.nvim | インライン診断 |
| lazydev.nvim | Lua/Neovim API の補完・型チェック強化 |
:::

:::details Fuzzy Finder / ナビゲーション
| プラグイン | 用途 |
|------------|------|
| snacks.nvim | Picker / Dashboard / Zen / Words / Session |
| telescope.nvim | ファジーファインダー（サブ） |
| oil.nvim | バッファベースのファイルエクスプローラー |
| neo-tree.nvim | ツリー形式ファイルエクスプローラー |
| yazi.nvim | yaziファイルマネージャー統合 |
| dropbar.nvim | Winbar / パンくずリスト |
| flash.nvim | ジャンプ（`<CR>` でスマートジャンプ） |
| aerial.nvim | シンボルアウトライン |
| project.nvim | プロジェクトルート自動検出 |
:::

:::details UI / 見た目
| プラグイン | 用途 |
|------------|------|
| kanagawa.nvim | カラースキーム（dragon + 透明） |
| lualine.nvim | ステータスライン |
| barbar.nvim | タブバー |
| noice.nvim | コマンドラインUI / 通知 |
| nvim-notify | 通知システム |
| nvim-scrollbar / satellite.nvim | スクロールバー |
| modes.nvim | モード別カーソル色変化 |
| nvim-illuminate | カーソル下シンボルのハイライト |
| incline.nvim | フローティングファイル名 |
| todo-comments.nvim | TODO/FIXME等のハイライト |
| render-markdown.nvim | Markdownのリッチレンダリング |
| nvim-highlight-colors | カラーコードのインラインプレビュー |
:::

:::details Git
| プラグイン | 用途 |
|------------|------|
| gitsigns.nvim | Git差分サインカラム |
| diffview.nvim | 差分ビュー / ファイル履歴 |
| lazygit.nvim | LazyGit統合 |
| vim-fugitive | Git操作 |
| octo.nvim | GitHub Issue / PR / Notification 操作 |
:::

:::details エディタ機能
| プラグイン | 用途 |
|------------|------|
| nvim-treesitter | シンタックスハイライト / インデント |
| nvim-treesitter-textobjects | 関数・クラス・引数単位のテキストオブジェクト |
| nvim-autopairs | 括弧自動補完 |
| mini.ai / surround / comment | テキストオブジェクト・Surround・コメント |
| nvim-spider | CamelCase/snake_case対応 w/e/b |
| substitute.nvim | レジスタを使った置換 |
| dial.nvim | `<C-a>/<C-x>` の拡張インクリメント |
| which-key.nvim | キーマップヘルプ |
| toggleterm.nvim | フローティングターミナル |
| kulala.nvim | REST client (.http ファイル) |
| persistence.nvim | セッション管理 |
:::

:::details AI統合
| プラグイン | 用途 |
|------------|------|
| claudecode.nvim | Claude Code統合 |
| opencode.nvim | opencode統合 |
| CopilotChat.nvim | GitHub Copilot Chat |
| copilot.lua | GitHub Copilot補完 |
:::

:::details デバッグ / テスト
| プラグイン | 用途 |
|------------|------|
| nvim-dap + nvim-dap-ui | デバッガー |
| nvim-dap-vscode-js | JS/TS デバッグアダプタ |
| neotest | テストランナー |
| neotest-jest / vitest / playwright | テストアダプタ |
| nvim-coverage | カバレッジ表示 |
:::

## まとめ
ぜひ一度使ってみてください！issueやPRはもう大歓迎です！！！！
https://github.com/nazozokc/NazoVim
