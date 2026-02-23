let terminal, cmdInput;

// Initialize after DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  terminal = document.getElementById("terminal");
  cmdInput = document.getElementById("cmdInput");

  if (!terminal || !cmdInput) {
    console.error("DOM elements not found");
    return;
  }

  // Command input handler
  cmdInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const cmd = cmdInput.value.trim();
      if (!cmd) return;
      cmdInput.value = "";
      await executeCommand(cmd);
    }
  });

  // Click command handlers
  document.querySelectorAll('.click-item').forEach(item => {
    item.addEventListener('click', () => {
      const cmd = item.dataset.cmd;
      executeCommand(cmd);
    });
  });

  // Start terminal
  initTerminal();
});

// Create output line with animation
function createOutputLine(content, className = '') {
  const line = document.createElement('div');
  line.className = `output-line ${className}`;
  line.innerHTML = content;
  terminal.appendChild(line);
  scrollToBottom();
  return line;
}

// Typing animation
async function typeText(text, element, speed = 12) {
  let i = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
        scrollToBottom();
      } else {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

async function appendLines(lines, delay = 15) {
  for (const line of lines) {
    const el = createOutputLine('');
    await typeText(line, el, delay);
    await sleep(30);
  }
}

// Sleep utility
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Scroll to bottom
function scrollToBottom() {
  const scrollHeight = document.body.scrollHeight;
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: scrollHeight,
      behavior: 'smooth'
    });
  } else {
    window.scrollTo(0, scrollHeight);
  }
}

// Execute command
async function executeCommand(cmd) {
  // Show executed command
  createOutputLine(
    `<span class="prompt-user">nazozokc@arch</span>:<span class="prompt-path">~</span>$ <span class="cmd-highlight">${escapeHtml(cmd)}</span>`
  );
  await sleep(100);

  switch (cmd) {
    case "neovim":
      await handleNeovim();
      break;
    case "nix":
      await handleNix();
      break;
    case "wezterm":
      await handleWezterm();
      break;
    case "blog":
      await handleBlog();
      break;
    case "X":
      createOutputLine('<a href="https://x.com/@NazozoK6519" target="_blank" class="repo-url">https://x.com/@NazozoK6519</a>');
      break;
    case "github":
      createOutputLine('<a href="https://github.com/nazozokc" target="_blank" class="repo-url">https://github.com/nazozokc</a>');
      break;
    case ":q":
      await handleQuit();
      break;
    case "clear":
      handleClear();
      break;
    default:
      createOutputLine(`<span class="error-msg">command not found: ${escapeHtml(cmd)}</span>`);
  }
}

// Neovim command
async function handleNeovim() {
  await appendLines([
    "",
    "  ╭──────────────────────────────────────────────╮",
    "  │           Neovim Environment                 │",
    "  ├──────────────────────────────────────────────┤",
    "  │  manager   │  lazy.nvim                      │",
    "  │  theme     │  kanagawa-dragon                │",
    "  │  policy    │  軽さ / 自作 / 可読性            │",
    "  ├──────────────────────────────────────────────┤",
    "  │  LSP       │  lua_ls, ts_ls, html, nixd      │",
    "  │  finder    │  snacks.nvim, telescope         │",
    "  │  status    │  lualine, noice, nvim-notify    │",
    "  │  git       │  gitsigns, lazygit, octo        │",
    "  │  debug     │  nvim-dap, neotest              │",
    "  ├──────────────────────────────────────────────┤",
    "  │  leader    │  Space                          │",
    "  │  indent    │  2 spaces                       │",
    "  ╰──────────────────────────────────────────────╯",
    ""
  ], 10);
}

// Nix command
async function handleNix() {
  await appendLines([
    "",
    "  ╭──────────────────────────────────────────────╮",
    "  │              Nix Environment                 │",
    "  ├──────────────────────────────────────────────┤",
    "  │  system    │  Linux / macOS (cross-platform) │",
    "  │  manager   │  home-manager / nix-darwin      │",
    "  │  shell     │  fish                           │",
    "  ├──────────────────────────────────────────────┤",
    "  │  packages  │  neovim, vscode, zed            │",
    "  │  cli       │  jq, bat, fzf, zoxide, yazi     │",
    "  │  dev       │  nodejs, bun, deno, rustc       │",
    "  │  tools     │  git, gh, ghq, lazygit          │",
    "  ├──────────────────────────────────────────────┤",
    "  │  command   │  nix run .#switch               │",
    "  ╰──────────────────────────────────────────────╯",
    ""
  ], 10);
}

// WezTerm command
async function handleWezterm() {
  await appendLines([
    "",
    "  ╭──────────────────────────────────────────────╮",
    "  │            WezTerm Environment               │",
    "  ├──────────────────────────────────────────────┤",
    "  │  config    │  lua (modular)                  │",
    "  │  theme     │  kanagawa (custom palette)      │",
    "  │  opacity   │  0.90 (toggle: Ctrl+Shift+F)    │",
    "  ├──────────────────────────────────────────────┤",
    "  │  split-h   │  Ctrl+Shift+E                   │",
    "  │  split-v   │  Ctrl+Shift+D                   │",
    "  │  focus     │  Ctrl+Shift+h/j/k/l             │",
    "  │  resize    │  Ctrl+Shift+Alt+h/j/k/l         │",
    "  │  tab       │  Ctrl+Shift+T / W               │",
    "  │  fullscreen│  Alt+Enter                      │",
    "  ├──────────────────────────────────────────────┤",
    "  │  ime       │  enabled (Japanese input)       │",
    "  ╰──────────────────────────────────────────────╯",
    ""
  ], 10);
}

// Blog command
async function handleBlog() {
  const loading = createOutputLine('<span class="loading">loading blog list</span>');

  try {
    const response = await fetch("./blog/index.json");
    if (!response.ok) throw new Error("Not found");
    const posts = await response.json();
    loading.remove();

    createOutputLine("<span class='accent'>blog posts:</span>");
    createOutputLine("");

    for (const post of posts) {
      const postDiv = document.createElement('div');
      postDiv.className = 'blog-item';
      postDiv.dataset.file = post.file;
      postDiv.innerHTML = `<span class="blog-emoji">${post.emoji}</span> <span class="blog-title">${escapeHtml(post.title)}</span>`;
      terminal.appendChild(postDiv);
      await sleep(50);
      scrollToBottom();
    }

    createOutputLine("");
    createOutputLine("<span class='muted'>click to read</span>");

    document.querySelectorAll('.blog-item').forEach(item => {
      item.addEventListener('click', () => {
        loadBlogPost(item.dataset.file);
      });
    });

  } catch (err) {
    loading.remove();
    createOutputLine('<span class="error-msg">error: failed to load blog list</span>');
  }
}

async function loadBlogPost(file) {
  const loading = createOutputLine('<span class="loading">loading post</span>');

  try {
    const response = await fetch(`./blog/${file}`);
    if (!response.ok) throw new Error("Not found");
    const md = await response.text();
    loading.remove();
    
    let content = md.replace(/^---[\s\S]*?---\n?/, '');
    displayMarkdown(content, true);
  } catch (err) {
    loading.remove();
    createOutputLine('<span class="error-msg">error: failed to load post</span>');
  }
}

// Quit command
async function handleQuit() {
  terminal.innerHTML = "";
  await sleep(100);
  await initTerminal();
}

// Clear command
function handleClear() {
  terminal.innerHTML = "";
}

// Display markdown
function displayMarkdown(md, showBackTop = false) {
  if (typeof marked === 'undefined') {
    createOutputLine('<span class="error-msg">error: markdown parser not loaded</span>');
    return;
  }
  const div = document.createElement("div");
  div.className = "md";
  div.innerHTML = marked.parse(md);
  terminal.appendChild(div);
  scrollToBottom();

  if (showBackTop) {
    displayBackTop();
  }
}

// Back to top button
function displayBackTop() {
  const backTop = document.createElement("div");
  backTop.className = "back-top";
  backTop.innerHTML = "← [top]";
  backTop.onclick = () => {
    terminal.innerHTML = "";
    initTerminal();
  };
  terminal.appendChild(backTop);
  scrollToBottom();
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize terminal
async function initTerminal() {
  terminal.innerHTML = "";

  createOutputLine(
    `<span class="prompt-user">nazozokc@arch</span>:<span class="prompt-path">~</span>$ <span class="cmd-highlight">whoami</span>`
  );
  await sleep(150);
  createOutputLine("nazozokc");
  await sleep(250);

  createOutputLine(
    `<span class="prompt-user">nazozokc@arch</span>:<span class="prompt-path">~</span>$ <span class="cmd-highlight">cat about.txt</span>`
  );
  await sleep(150);
  await appendLines([
    "中学生プログラマ",
    "Arch Linux / Neovim / TypeScript",
    "API開発・CLIツール・環境構築が好き"
  ], 18);
  await sleep(250);

  createOutputLine(
    `<span class="prompt-user">nazozokc@arch</span>:<span class="prompt-path">~</span>$ <span class="cmd-highlight">ls skills/</span>`
  );
  await sleep(150);
  createOutputLine("<span class='skill-tag primary'>TypeScript</span><span class='skill-tag secondary'>JavaScript</span><span class='skill-tag secondary'>Node.js</span>");
  createOutputLine("<span class='skill-tag secondary'>React</span><span class='skill-tag secondary'>Linux</span><span class='skill-tag secondary'>Neovim</span>");
  await sleep(250);

  // projects
  createOutputLine(
    `<span class="prompt-user">nazozokc@arch</span>:<span class="prompt-path">~</span>$ <span class="cmd-highlight">ls projects/</span>`
  );
  await sleep(200);

  const loading = createOutputLine('<span class="loading">loading repositories</span>');

  try {
    const response = await fetch("https://api.github.com/users/nazozokc/repos?sort=updated");
    const repos = await response.json();
    loading.remove();

    const filteredRepos = repos.filter(r => !r.fork).slice(0, 6);

    for (const repo of filteredRepos) {
      const repoDiv = document.createElement('div');
      repoDiv.className = 'repo-item';
      repoDiv.innerHTML = `
        <div class="repo-name">${escapeHtml(repo.name)}</div>
        <div class="repo-desc">${escapeHtml(repo.description || "no description")}</div>
        <a href="${repo.html_url}" target="_blank" class="repo-url">${repo.html_url}</a>
      `;
      terminal.appendChild(repoDiv);
      await sleep(100);
      scrollToBottom();
    }

    await sleep(200);
    createOutputLine("");
    createOutputLine("<span class='muted'>select command from below ↓</span>");

  } catch (err) {
    loading.remove();
    createOutputLine('<span class="error-msg">error: failed to load repositories</span>');
  }
}