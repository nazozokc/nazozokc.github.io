const CACHE_KEY_REPOS = 'github_repos';
const CACHE_KEY_BLOG = 'blog_posts';
const CACHE_EXPIRY = 5 * 60 * 1000;

let currentView = 'home';
let currentPostSlug = null;

function getCachedData(key) {
  const cached = localStorage.getItem(key);
  if (!cached) return null;
  try {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_EXPIRY) {
      return data;
    }
  } catch {}
  return null;
}

function setCachedData(key, data) {
  localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function switchView(view) {
  const homeView = document.getElementById('homeView');
  const blogView = document.getElementById('blogView');
  const navLinks = document.querySelectorAll('[data-view]');
  
  currentView = view;
  
  if (view === 'home') {
    if (homeView) homeView.style.display = 'block';
    if (blogView) blogView.style.display = 'none';
    currentPostSlug = null;
    window.scrollTo(0, 0);
  } else if (view === 'blog') {
    if (homeView) homeView.style.display = 'none';
    if (blogView) blogView.style.display = 'block';
    loadBlogList();
    window.scrollTo(0, 0);
  }
  
  navLinks.forEach(link => {
    if (link.dataset.view === view) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function getLanguageColor(lang) {
  const colors = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Rust: '#dea584',
    Go: '#00ADD8',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051'
  };
  return colors[lang] || '#858585';
}

async function loadRepositories() {
  const container = document.getElementById('reposContainer');
  if (!container) return;

  try {
    let repos;
    const cachedRepos = getCachedData(CACHE_KEY_REPOS);
    if (cachedRepos) {
      repos = cachedRepos;
    } else {
      const response = await fetch("https://api.github.com/users/nazozokc/repos?sort=updated&per_page=20");
      if (!response.ok) {
        if (response.status === 403 || response.status === 429) {
          throw new Error('rate_limit');
        }
        throw new Error('network');
      }
      repos = await response.json();
      setCachedData(CACHE_KEY_REPOS, repos);
    }

    const filteredRepos = repos.filter(r => !r.fork).slice(0, 8);

    if (filteredRepos.length === 0) {
      container.innerHTML = '<p class="loading">No repositories found</p>';
      return;
    }

    container.innerHTML = filteredRepos.map(repo => `
      <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-card">
        <div class="repo-name">${escapeHtml(repo.name)}</div>
        <p class="repo-desc">${escapeHtml(repo.description || 'No description')}</p>
        <div class="repo-meta">
          ${repo.language ? `
            <span class="repo-language">
              <span class="language-dot" style="background: ${getLanguageColor(repo.language)}"></span>
              ${escapeHtml(repo.language)}
            </span>
          ` : ''}
          <span>★ ${repo.stargazers_count}</span>
          <span>⑂ ${repo.forks_count}</span>
        </div>
      </a>
    `).join('');

  } catch (err) {
    if (err.message === 'rate_limit') {
      container.innerHTML = '<p class="error-msg">API rate limit exceeded. Please try again later.</p>';
    } else if (err.message === 'network') {
      container.innerHTML = '<p class="error-msg">Network error. Please check your connection.</p>';
    } else {
      container.innerHTML = '<p class="error-msg">Failed to load repositories</p>';
    }
  }
}

async function loadBlogList() {
  const container = document.getElementById('blogContainer');
  if (!container) return;

  try {
    const indexResponse = await fetch('blog-index.json');
    if (!indexResponse.ok) {
      throw new Error('Failed to load blog index');
    }
    const posts = await indexResponse.json();

    if (!posts || posts.length === 0) {
      container.innerHTML = '<p class="loading">No blog posts found</p>';
      return;
    }

    container.innerHTML = posts.map(post => `
      <a href="#" class="blog-card" data-post="${post.slug}">
        <div class="blog-header">
          <span class="blog-emoji">${post.emoji}</span>
          <span class="blog-date">${post.date}</span>
        </div>
        <h3 class="blog-title">${escapeHtml(post.title)}</h3>
        <span class="blog-category">${escapeHtml(post.category)}</span>
      </a>
    `).join('');

    container.querySelectorAll('[data-post]').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        loadBlogPost(card.dataset.post);
      });
    });

  } catch (err) {
    container.innerHTML = '<p class="error-msg">Failed to load blog posts</p>';
  }
}

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
  postContainer.innerHTML = '<p class="loading">Loading...</p>';
  postContainer.style.display = 'block';
  if (blogHero) blogHero.style.display = 'none';
  if (blogSection) blogSection.style.display = 'none';

  try {
    const response = await fetch(`blog/${slug}.md`);
    if (!response.ok) {
      throw new Error('Failed to load post');
    }
    const markdown = await response.text();

    const indexResponse = await fetch('blog-index.json');
    const posts = await indexResponse.json();
    const post = posts.find(p => p.slug === slug);

    const html = marked.parse(markdown);
    postContainer.innerHTML = `
      <div class="post-card">
        <a href="#" class="back-link" id="backToList">← 一覧に戻る</a>
        <article class="post-content">
          <header class="post-header">
            <div class="post-meta">
              <span class="post-emoji">${post?.emoji || ''}</span>
              <span class="post-date">${post?.date || ''}</span>
              <span class="post-category">${post?.category || ''}</span>
            </div>
            <h1 class="post-title">${post?.title || slug}</h1>
          </header>
          <div class="markdown-body">${html}</div>
        </article>
      </div>
    `;
    
    document.getElementById('backToList').addEventListener('click', (e) => {
      e.preventDefault();
      showBlogList();
    });
  } catch (err) {
    postContainer.innerHTML = `
      <div class="post-card">
        <a href="#" class="back-link" id="backToList">← 一覧に戻る</a>
        <p class="error-msg">Failed to load blog post</p>
      </div>
    `;
    document.getElementById('backToList').addEventListener('click', (e) => {
      e.preventDefault();
      showBlogList();
    });
  }
}

function loadBlog() {
  loadBlogList();
}

document.addEventListener('DOMContentLoaded', () => {
  loadRepositories();

  document.querySelectorAll('[data-view]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(link.dataset.view);
    });
  });

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
});
