const CACHE_KEY_REPOS = 'github_repos';
const CACHE_KEY_EVENTS = 'github_events';
const CACHE_KEY_BLOG_VERSION = 'blog_manifest_version';
const CACHE_EXPIRY = 5 * 60 * 1000;
const BLOG_POLL_INTERVAL = 30 * 1000;

let currentView = 'home';
let currentPostSlug = null;

// ─── Scroll-triggered entrance animations ───────────────────────────────────

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.animationDelay = `${i * 0.06}s`;
          el.classList.add('animate-in');
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );

  document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
}

// スキルバーをIntersectionObserverで起動
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(bar => observer.observe(bar));
}

// ─── Count-up animation for stat values ─────────────────────────────────────

function animateCount(el, target, duration = 800) {
  if (target === '-' || isNaN(Number(target))) {
    el.textContent = target;
    return;
  }
  const end = Number(target);
  const start = 0;
  const range = end - start;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(start + range * ease);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

// ─── Cache helpers ───────────────────────────────────────────────────────────

function getCachedData(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY) return data;
  } catch (err) {
    console.error(`Cache parse error for ${key}:`, err);
  }
  return null;
}

function setCachedData(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

// ─── Utils ───────────────────────────────────────────────────────────────────

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fm = {};
  const lines = match[1].split('\n');
  for (const line of lines) {
    const ci = line.indexOf(':');
    if (ci === -1) continue;
    const key = line.slice(0, ci).trim();
    let value = line.slice(ci + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    fm[key] = value;
  }
  return fm;
}

// ─── View switching ──────────────────────────────────────────────────────────

function switchView(view) {
  const homeView = document.getElementById('homeView');
  const blogView = document.getElementById('blogView');
  const zennView = document.getElementById('zennView');
  const navLinks = document.querySelectorAll('[data-view]');

  currentView = view;

  if (view === 'home') {
    homeView?.style.setProperty('display', 'block');
    blogView?.style.setProperty('display', 'none');
    zennView?.style.setProperty('display', 'none');
    currentPostSlug = null;
    window.scrollTo(0, 0);
  } else if (view === 'blog') {
    homeView?.style.setProperty('display', 'none');
    blogView?.style.setProperty('display', 'block');
    zennView?.style.setProperty('display', 'none');
    loadBlogList();
    window.scrollTo(0, 0);
  } else if (view === 'zenn') {
    homeView?.style.setProperty('display', 'none');
    blogView?.style.setProperty('display', 'none');
    zennView?.style.setProperty('display', 'block');
    loadZennArticles();
    window.scrollTo(0, 0);
  }

  navLinks.forEach(link => {
    link.classList.toggle('active', link.dataset.view === view);
  });
}

// ─── Language colors ─────────────────────────────────────────────────────────

function getLanguageColor(lang) {
  const colors = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Nix: '#7e7eff',
    Lua: '#000080',
  };
  return colors[lang] || '#858585';
}

// ─── Load repositories ───────────────────────────────────────────────────────

async function loadRepositories() {
  const container = document.getElementById('reposContainer');
  if (!container) return;

  try {
    let repos = getCachedData(CACHE_KEY_REPOS);
    if (!repos) {
      const res = await fetch('https://api.github.com/users/nazozokc/repos?sort=updated&per_page=20');
      if (!res.ok) throw new Error(res.status === 403 || res.status === 429 ? 'rate_limit' : 'network');
      repos = await res.json();
      setCachedData(CACHE_KEY_REPOS, repos);
    }

    const filtered = repos.filter(r => !r.fork).slice(0, 8);
    if (filtered.length === 0) {
      container.innerHTML = '<p class="loading">No repositories found</p>';
      return;
    }

    container.innerHTML = filtered.map(repo => `
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card">
        <div class="repo-name">${escapeHtml(repo.name)}</div>
        <p class="repo-desc">${escapeHtml(repo.description || 'No description')}</p>
        <div class="repo-meta">
          ${repo.language ? `
            <span class="repo-language">
              <span class="language-dot" style="background:${getLanguageColor(repo.language)}"></span>
              ${escapeHtml(repo.language)}
            </span>` : ''}
          <span>★ ${repo.stargazers_count}</span>
          <span>⑂ ${repo.forks_count}</span>
        </div>
      </a>
    `).join('');

  } catch (err) {
    container.innerHTML = err.message === 'rate_limit'
      ? '<p class="error-msg">API rate limit exceeded. Try again later.</p>'
      : '<p class="error-msg">Failed to load repositories</p>';
  }
}

// ─── Contribution stats ───────────────────────────────────────────────────────

async function loadContributionStats() {
  const totalEl = document.getElementById('totalContributions');
  const todayEl = document.getElementById('todayContributions');
  if (!totalEl || !todayEl) return;

  try {
    let events = getCachedData(CACHE_KEY_EVENTS);
    if (!events) {
      const res = await fetch('https://api.github.com/users/nazozokc/events?per_page=100');
      if (!res.ok) throw new Error(res.status === 403 || res.status === 429 ? 'rate_limit' : 'network');
      events = await res.json();
      setCachedData(CACHE_KEY_EVENTS, events);
    }

    const now = new Date();
    const today = now.toDateString();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    let totalCount = 0, todayCount = 0;

    for (const event of events) {
      if (event.type !== 'PushEvent') continue;
      const eventDate = new Date(event.created_at);
      if (eventDate < ninetyDaysAgo) continue;
      totalCount += event.payload.commits?.length || 0;
      if (eventDate.toDateString() === today) {
        todayCount += event.payload.commits?.length || 0;
      }
    }

    animateCount(totalEl, totalCount);
    animateCount(todayEl, todayCount);

  } catch (err) {
    console.error('Contribution stats load error:', err);
    totalEl.textContent = err.message === 'rate_limit' ? 'API制限' : '-';
    todayEl.textContent = err.message === 'rate_limit' ? 'API制限' : '-';
  }
}

// ─── Blog list ───────────────────────────────────────────────────────────────

async function checkBlogUpdate() {
  try {
    const res = await fetch('blog-manifest.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const manifest = await res.json();
    const version = manifest.version || 1;
    const lastVersion = localStorage.getItem(CACHE_KEY_BLOG_VERSION);
    if (lastVersion && String(version) !== lastVersion) {
      localStorage.setItem(CACHE_KEY_BLOG_VERSION, String(version));
      return manifest;
    }
    localStorage.setItem(CACHE_KEY_BLOG_VERSION, String(version));
  } catch (err) {
    console.error('Blog version check error:', err);
  }
  return null;
}

function startBlogPolling() {
  setInterval(async () => {
    if (currentView !== 'blog' || currentPostSlug) return;
    const updatedManifest = await checkBlogUpdate();
    if (updatedManifest) {
      loadBlogList();
    }
  }, BLOG_POLL_INTERVAL);
}

async function loadBlogList() {
  const container = document.getElementById('blogContainer');
  if (!container) return;

  try {
    const manifestRes = await fetch('blog-manifest.json');
    if (!manifestRes.ok) throw new Error('manifest');
    const manifest = await manifestRes.json();
    const slugs = Array.isArray(manifest) ? manifest : manifest.posts || [];
    const version = manifest.version || 1;
    localStorage.setItem(CACHE_KEY_BLOG_VERSION, String(version));

    const postFiles = await Promise.all(
      slugs.map(slug =>
        fetch(`blog/${slug}.md`)
          .then(r => r.ok ? r.text() : null)
          .catch(() => null)
      )
    );

    const posts = slugs
      .map((slug, i) => {
        const markdown = postFiles[i];
        if (!markdown) return null;
        const fm = parseFrontmatter(markdown);
        if (!fm) return null;
        return {
          slug,
          title: fm.title || slug,
          emoji: fm.emoji || '📝',
          date: fm.date || '',
          category: fm.category || '',
        };
      })
      .filter(Boolean);

    if (posts.length === 0) {
      container.innerHTML = '<p class="loading">No blog posts found</p>';
      return;
    }

    container.innerHTML = posts.map(post => `
      <a href="#" class="blog-card" data-post="${post.slug}">
        <div class="blog-header">
          <span class="blog-emoji">${escapeHtml(post.emoji)}</span>
          <span class="blog-date">${escapeHtml(post.date)}</span>
        </div>
        <h3 class="blog-title">${escapeHtml(post.title)}</h3>
        <span class="blog-category">${escapeHtml(post.category)}</span>
      </a>
    `).join('');

    container.querySelectorAll('[data-post]').forEach(card => {
      card.addEventListener('click', e => {
        e.preventDefault();
        loadBlogPost(card.dataset.post);
      });
    });

  } catch (err) {
    console.error('Blog list load error:', err);
    container.innerHTML = '<p class="error-msg">Failed to load blog posts</p>';
  }
}

// ─── Zenn articles ────────────────────────────────────────────────────────────

async function loadZennArticles() {
  const container = document.getElementById('zennContainer');
  if (!container) return;

  try {
    const res = await fetch('https://zenn.dev/api/articles?username=nazozokc&order=latest');
    if (!res.ok) throw new Error('zenn');
    const data = await res.json();
    const articles = data.articles || [];

    if (articles.length === 0) {
      container.innerHTML = '<p class="loading">No articles found</p>';
      return;
    }

    container.innerHTML = articles.map(article => `
      <a href="https://zenn.dev/nazozokc/articles/${article.slug}" target="_blank" rel="noopener noreferrer" class="blog-card">
        <div class="blog-header">
          <span class="blog-emoji">${escapeHtml(article.emoji || '📝')}</span>
          <span class="blog-date">${new Date(article.published_at).toLocaleDateString('ja-JP')}</span>
        </div>
        <h3 class="blog-title">${escapeHtml(article.title)}</h3>
        <span class="blog-category">${escapeHtml(article.article_type || '')}</span>
      </a>
    `).join('');

  } catch (err) {
    console.error('Zenn load error:', err);
    container.innerHTML = '<p class="error-msg">Failed to load Zenn articles</p>';
  }
}

// ─── Blog post ───────────────────────────────────────────────────────────────

function showBlogList() {
  const postContainer = document.getElementById('postContainer');
  const blogHero = document.getElementById('blogHero');
  const blogSection = document.getElementById('blogSection');

  currentPostSlug = null;
  if (postContainer) postContainer.style.display = 'none';
  if (blogHero) blogHero.style.display = 'block';
  if (blogSection) blogSection.style.display = 'block';
}

async function loadBlogPost(slug) {
  const postContainer = document.getElementById('postContainer');
  const blogHero = document.getElementById('blogHero');
  const blogSection = document.getElementById('blogSection');
  if (!postContainer) return;

  currentPostSlug = slug;
  postContainer.innerHTML = '<p class="loading">Loading</p>';
  postContainer.style.display = 'block';
  if (blogHero) blogHero.style.display = 'none';
  if (blogSection) blogSection.style.display = 'none';
  window.scrollTo(0, 0);

  try {
    const res = await fetch(`blog/${slug}.md`);
    if (!res.ok) throw new Error('load');
    const markdown = await res.text();
    const fm = parseFrontmatter(markdown);
    const html = marked.parse(markdown.replace(/^---[\s\S]*?---\n/, ''));

    postContainer.innerHTML = `
      <div class="post-card">
        <a href="#" class="back-link" id="backToList">← 一覧に戻る</a>
        <article class="post-content">
          <header class="post-header">
            <div class="post-meta">
              <span class="post-emoji">${escapeHtml(fm?.emoji || '')}</span>
              <span class="post-date">${escapeHtml(fm?.date || '')}</span>
              <span class="post-category">${escapeHtml(fm?.category || '')}</span>
            </div>
            <h1 class="post-title">${escapeHtml(fm?.title || slug)}</h1>
          </header>
          <div class="markdown-body">${html}</div>
        </article>
      </div>
    `;

    document.getElementById('backToList').addEventListener('click', e => {
      e.preventDefault();
      showBlogList();
    });

  } catch (err) {
    console.error('Blog post load error:', err);
    postContainer.innerHTML = `
      <div class="post-card">
        <a href="#" class="back-link" id="backToList">← 一覧に戻る</a>
        <p class="error-msg">Failed to load post</p>
      </div>
    `;
    document.getElementById('backToList').addEventListener('click', e => {
      e.preventDefault();
      showBlogList();
    });
  }
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'night') {
    document.documentElement.setAttribute('data-theme', 'night');
    if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isNight = document.documentElement.getAttribute('data-theme') === 'night';
      if (isNight) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'day');
        themeToggle.setAttribute('aria-pressed', 'false');
      } else {
        document.documentElement.setAttribute('data-theme', 'night');
        localStorage.setItem('theme', 'night');
        themeToggle.setAttribute('aria-pressed', 'true');
      }
    });
  }

  // Nav
  document.querySelectorAll('[data-view]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchView(link.dataset.view);
    });
  });

  // Data
  Promise.all([loadRepositories(), loadContributionStats()]);
  checkBlogUpdate();
  startBlogPolling();

  // Scroll animations (slight delay so initial render is done)
  requestAnimationFrame(() => {
    initScrollAnimations();
    initSkillBars();
  });
});
