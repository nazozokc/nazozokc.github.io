let terminal, cmdInput;
let isBlogMode = false;

document.addEventListener('DOMContentLoaded', () => {
  terminal = document.getElementById("terminal");
  cmdInput = document.getElementById("cmdInput");

  if (!terminal || !cmdInput) {
    console.error("DOM elements not found");
    return;
  }

  cmdInput.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      const cmd = cmdInput.value.trim();
      if (!cmd) return;
      cmdInput.value = "";
      await executeCommand(cmd);
    }
  });

  document.querySelectorAll('.click-item').forEach(item => {
    item.addEventListener('click', () => {
      const cmd = item.dataset.cmd;
      executeCommand(cmd);
    });
  });

  initTerminal();

  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'night') {
    document.documentElement.setAttribute('data-theme', 'night');
  }
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'night') {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'day');
    } else {
      document.documentElement.setAttribute('data-theme', 'night');
      localStorage.setItem('theme', 'night');
    }
  });

  // Terminal/Blog mode buttons
  const terminalBtn = document.getElementById('terminalBtn');
  const blogBtn = document.getElementById('blogBtn');
  const terminalTitle = document.getElementById('terminalTitle');
  const terminalContainer = document.getElementById('terminalContainer');
  const blogContainer = document.getElementById('blogContainer');

  if (terminalBtn) {
    terminalBtn.addEventListener('click', () => {
      switchToTerminal();
    });
  }

  if (blogBtn) {
    blogBtn.addEventListener('click', () => {
      switchToBlog();
    });
  }

  function switchToTerminal() {
    if (!isBlogMode) return;
    isBlogMode = false;
    terminalTitle.textContent = 'terminal';
    terminalBtn.classList.add('active');
    blogBtn.classList.remove('active');
    terminalContainer.hidden = false;
    blogContainer.hidden = true;
    handleQuit();
  }

  function switchToBlog() {
    if (isBlogMode) return;
    isBlogMode = true;
    terminalTitle.textContent = 'blog';
    terminalBtn.classList.remove('active');
    blogBtn.classList.add('active');
    terminalContainer.hidden = true;
    blogContainer.hidden = false;
    renderBlogPosts();
  }
});

function createOutputLine(content, className = '') {
  const line = document.createElement('div');
  line.className = `output-line ${className}`;
  line.innerHTML = content;
  terminal.appendChild(line);
  scrollToBottom();
  return line;
}

async function typeText(text, element, speed = 12) {
  if (text.includes('<') && text.includes('>')) {
    element.innerHTML = text;
    scrollToBottom();
    return;
  }
  let i = 0;
  return new Promise(resolve => {
    const interval = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text[i];
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

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

async function executeCommand(cmd) {
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
    case "X":
      createOutputLine('<a href="https://x.com/@NazozoK6519" target="_blank" rel="noopener noreferrer" class="repo-url">https://x.com/@NazozoK6519</a>');
      break;
    case "github":
      await handleGithub();
      break;
    case "blog":
      await handleBlog();
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

async function handleNeovim() {
  await appendLines([
    "",
    "  <div aria-hidden=\"true\">",
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
    "  </div>",
    ""
  ], 10);
}

async function handleNix() {
  await appendLines([
    "",
    "  <div aria-hidden=\"true\">",
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
    "  </div>",
    ""
  ], 10);
}

async function handleWezterm() {
  await appendLines([
    "",
    "  <div aria-hidden=\"true\">",
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
    "  </div>",
    ""
  ], 10);
}

async function handleGithub() {
  const loading = createOutputLine('<span class="loading">loading github info</span>');

  try {
    const userRes = await fetch("https://api.github.com/users/nazozokc");
    const user = await userRes.json();
    loading.remove();
    
    createOutputLine("<span class='accent'>GitHub Profile:</span>");
    createOutputLine("");
    createOutputLine(`<span class='repo-name'>${escapeHtml(user.name || "nazozokc")}</span>`);
    createOutputLine(`<span class="muted">${escapeHtml(user.bio || "")}</span>`);
    createOutputLine(`<a href="${user.html_url}" target="_blank" rel="noopener noreferrer" class="repo-url">${user.html_url}</a>`);
    createOutputLine("");
    createOutputLine(`<span class="muted">repos: ${user.public_repos}</span> | <span class="muted">followers: ${user.followers}</span> | <span class="muted">following: ${user.following}</span>`);
    createOutputLine("");

    const loading2 = createOutputLine('<span class="loading">loading commit stats</span>');

    const reposRes = await fetch("https://api.github.com/users/nazozokc/repos?per_page=100");
    const repos = await reposRes.json();
    const ownRepos = repos.filter(r => !r.fork);

    const repoCommits = [];
    let totalCommits = 0;

    for (const repo of ownRepos) {
      try {
        const commitsRes = await fetch(`https://api.github.com/repos/nazozokc/${repo.name}/commits?per_page=1`);
        const linkHeader = commitsRes.headers.get('link') || '';
        const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/);
        const commitCount = lastPageMatch ? parseInt(lastPageMatch[1]) : 1;
        
        repoCommits.push({ name: repo.name, commits: commitCount, url: repo.html_url });
        totalCommits += commitCount;
      } catch {
        repoCommits.push({ name: repo.name, commits: 0, url: repo.html_url });
      }
    }

    loading2.remove();

    createOutputLine(`<span class='accent'>total commits:</span> ${totalCommits}`);
    createOutputLine("");
    createOutputLine("<span class='accent'>top 3 repositories by commits:</span>");
    createOutputLine("");

    const top3 = repoCommits.sort((a, b) => b.commits - a.commits).slice(0, 3);
    
    for (const repo of top3) {
      createOutputLine(`<span class='repo-name'>${escapeHtml(repo.name)}</span> - ${repo.commits} commits`);
      createOutputLine(`<a href="${repo.url}" target="_blank" rel="noopener noreferrer" class="repo-url">${repo.url}</a>`);
      createOutputLine("");
    }

    createOutputLine('<a href="https://github.com/nazozokc" target="_blank" rel="noopener noreferrer" class="repo-url">view all repos →</a>');

  } catch (err) {
    loading.remove();
    createOutputLine('<span class="error-msg">error: failed to load github info</span>');
  }
}

async function handleQuit() {
  terminal.innerHTML = "";
  isBlogMode = false;
  if (terminalTitle) terminalTitle.textContent = 'terminal';
  if (terminalBtn) terminalBtn.classList.add('active');
  if (blogBtn) blogBtn.classList.remove('active');
  await sleep(100);
  await initTerminal();
}

async function handleBlog() {
  await appendLines([
    "",
    "<span class='accent'>blog posts:</span>",
    ""
  ], 10);

  const posts = await fetchBlogPosts();
  
  for (const post of posts) {
    const postDiv = document.createElement('div');
    postDiv.className = 'repo-item';
    postDiv.innerHTML = `
      <div class="repo-name">${escapeHtml(post.emoji || '')} ${escapeHtml(post.title)}</div>
      <span class="muted">${escapeHtml(post.date)} / ${escapeHtml(post.category)}</span>
    `;
    terminal.appendChild(postDiv);
    await sleep(100);
    scrollToBottom();
  }

  await sleep(200);
  createOutputLine("");

  // Add back button for blog mode
  const backBtn = document.createElement("button");
  backBtn.className = "back-top";
  backBtn.type = "button";
  backBtn.innerHTML = "← terminalに戻る";
  backBtn.onclick = () => {
    const tc = document.getElementById('terminalContainer');
    const bc = document.getElementById('blogContainer');
    terminal.innerHTML = "";
    isBlogMode = false;
    if (terminalTitle) terminalTitle.textContent = 'terminal';
    if (terminalBtn) terminalBtn.classList.add('active');
    if (blogBtn) blogBtn.classList.remove('active');
    if (tc) tc.hidden = false;
    if (bc) bc.hidden = true;
    initTerminal();
  };
  terminal.appendChild(backBtn);
  scrollToBottom();

  createOutputLine("<span class='muted'>select command from below ↓</span>");
}

async function fetchBlogPosts() {
  try {
    const response = await fetch('blog-index.json');
    if (!response.ok) throw new Error('Failed to fetch blog index');
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

async function fetchBlogPost(slug) {
  try {
    const response = await fetch(`blog/${slug}.md`);
    if (!response.ok) throw new Error('Failed to fetch blog post');
    return await response.text();
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

function renderBlogPosts() {
  const blogContent = document.getElementById('blogContent');
  if (!blogContent) return;
  
  blogContent.innerHTML = '<p class="loading">Loading...</p>';
  
  fetchBlogPosts().then(posts => {
    if (posts.length === 0) {
      blogContent.innerHTML = '<p class="muted">No blog posts found.</p>';
      return;
    }
    
    let html = `
      <h1 class="blog-title">blog posts</h1>
      <div class="blog-posts">
    `;
    
    for (const post of posts) {
      html += `
        <article class="blog-post-item" data-slug="${escapeHtml(post.slug)}">
          <span class="blog-post-emoji">${escapeHtml(post.emoji || '')}</span>
          <h2 class="blog-post-title">${escapeHtml(post.title)}</h2>
          <span class="blog-post-meta">${escapeHtml(post.date)} / ${escapeHtml(post.category)}</span>
        </article>
      `;
    }
    
    html += `</div>`;
    blogContent.innerHTML = html;
    
    // Add click handlers
    document.querySelectorAll('.blog-post-item').forEach(item => {
      item.addEventListener('click', () => {
        const slug = item.dataset.slug;
        renderBlogPost(slug);
      });
    });
  });
}

async function renderBlogPost(slug) {
  const blogContent = document.getElementById('blogContent');
  if (!blogContent) return;
  
  blogContent.innerHTML = '<p class="loading">Loading...</p>';
  
  const content = await fetchBlogPost(slug);
  if (!content) {
    blogContent.innerHTML = '<p class="muted">Failed to load blog post.</p>';
    return;
  }
  
  // Simple markdown parsing (headers, lists, code blocks, links)
  let html = content
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // Wrap consecutive <li> elements in <ul>
  html = html.replace(/(<li>.*<\/li>)+/g, '<ul>$&</ul>');
  
  // Wrap remaining text in <p>
  html = '<div class="blog-post-content">' + html + '</div>';
  
  blogContent.innerHTML = `
    <button class="back-button" onclick="renderBlogPosts()">← back</button>
    ${html}
  `;
  window.scrollTo(0, 0);
}

function handleClear() {
  terminal.innerHTML = "";
}

function displayBackTop() {
  const backTop = document.createElement("button");
  backTop.className = "back-top";
  backTop.type = "button";
  backTop.innerHTML = "← [top]";
  backTop.onclick = () => {
    const tc = document.getElementById('terminalContainer');
    const bc = document.getElementById('blogContainer');
    terminal.innerHTML = "";
    isBlogMode = false;
    if (terminalTitle) terminalTitle.textContent = 'terminal';
    if (terminalBtn) terminalBtn.classList.add('active');
    if (blogBtn) blogBtn.classList.remove('active');
    if (tc) tc.hidden = false;
    if (bc) bc.hidden = true;
    initTerminal();
  };
  terminal.appendChild(backTop);
  scrollToBottom();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

async function initTerminal() {
  terminal.innerHTML = "";
  isBlogMode = false;
  if (terminalTitle) terminalTitle.textContent = 'terminal';
  if (terminalBtn) terminalBtn.classList.add('active');
  if (blogBtn) blogBtn.classList.remove('active');

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
      const repoDiv = document.createElement('a');
      repoDiv.className = 'repo-item';
      repoDiv.href = repo.html_url;
      repoDiv.target = '_blank';
      repoDiv.rel = 'noopener noreferrer';
      repoDiv.innerHTML = `
        <div class="repo-name">${escapeHtml(repo.name)}</div>
        <div class="repo-desc">${escapeHtml(repo.description || "no description")}</div>
        <span class="repo-url">${repo.html_url}</span>
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
