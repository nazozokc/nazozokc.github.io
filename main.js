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
async function typeText(text, element, speed = 15) {
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

// Append multiple lines with delay
async function appendLines(lines, delay = 20) {
  for (const line of lines) {
    const el = createOutputLine('');
    await typeText(line, el, delay);
    await sleep(50);
  }
}

// Sleep utility
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Scroll to bottom
function scrollToBottom() {
  var scrollHeight = document.body.scrollHeight;
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
    "╔════════════════════════════════════╗",
    "║       Neovim Environment           ║",
    "╠════════════════════════════════════╣",
    "║  editor  │  Neovim                 ║",
    "║  theme   │  kanagawa-dragon        ║",
    "║  policy  │  軽さ / 自作 / 可読性    ║",
    "╚════════════════════════════════════╝",
    ""
  ], 15);
}

// Blog command
async function handleBlog() {
  const loading = createOutputLine('<span class="loading">loading latest blog</span>');

  try {
    const response = await fetch("./blog/index.md");
    if (!response.ok) throw new Error("Not found");
    const md = await response.text();
    loading.remove();
    displayMarkdown(md, true);
  } catch (err) {
    loading.remove();
    createOutputLine('<span class="error-msg">error: failed to load blog</span>');
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

  // whoami
  createOutputLine(
    `<span class="prompt-user">nazozokc@arch</span>:<span class="prompt-path">~</span>$ <span class="cmd-highlight">whoami</span>`
  );
  await sleep(200);
  createOutputLine("nazozokc");
  await sleep(300);

  // about
  createOutputLine(
    `<span class="prompt-user">nazozokc@arch</span>:<span class="prompt-path">~</span>$ <span class="cmd-highlight">cat about.txt</span>`
  );
  await sleep(200);
  await appendLines([
    "中学生プログラマ",
    "Arch Linux / Neovim / TypeScript",
    "API開発・CLIツール・環境構築が好き"
  ], 20);
  await sleep(300);

  // skills
  createOutputLine(
    `<span class="prompt-user">nazozokc@arch</span>:<span class="prompt-path">~</span>$ <span class="cmd-highlight">ls skills/</span>`
  );
  await sleep(200);
  createOutputLine("<span class='accent'>TypeScript</span>  <span class='muted'>JavaScript</span>  <span class='muted'>Node.js</span>");
  createOutputLine("<span class='muted'>React</span>       <span class='muted'>Linux</span>       <span class='muted'>Neovim</span>");
  await sleep(300);

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