---
name: nazozokc-portfolio
description: Help debug, improve, and maintain the nazozokc terminal-style HTML portfolio. Use this skill whenever the user wants to modify the portfolio design, add/remove features, fix bugs, optimize performance, improve GitHub API integration, or enhance the terminal UI/UX. This includes styling changes, JavaScript logic updates, new command implementations, and responsive design tweaks.
---

# nazozokc Portfolio Assistant

This skill helps with managing and improving the nazozokc terminal-style HTML portfolio website.

## Project Overview

The portfolio is a single-page HTML application that simulates a Linux terminal interface. It displays a developer's profile, skills, and GitHub repositories in an interactive terminal aesthetic.

**Key Features:**
- Terminal UI with blurred glassmorphism design
- Real-time GitHub API integration (user profile, repositories, commit stats)
- Interactive click-to-execute commands
- TypeScript/JavaScript focus display
- Responsive design with smooth animations
- Custom color scheme (kanagawa-inspired)

**Tech Stack:**
- HTML5, CSS3 (custom properties, animations, backdrop-filter)
- Vanilla JavaScript (async/await, fetch API)
- GitHub REST API for live data
- Marked.js library (currently loaded but not used)

---

## Architecture

### DOM Structure
```
<body>
├── <header class="top-bar">          // Sticky navigation
│   ├── Status indicator + title
│   └── Links (X, GitHub)
├── <main class="terminal-container">
│   ├── #terminal (output area)
│   ├── .input-line (command input)
│   └── .click-commands (button grid)
```

### Color Scheme (CSS Variables)
```
--bg: #0d0c0c              // Background
--bg-secondary: #181818    // Secondary bg
--fg: #c5c9c5              // Foreground text
--green: #8a9a7b           // Accent (primary)
--blue: #8ba4b0            // Accent (secondary)
--red: #c4746e             // Error
--yellow: #c4b28a          // Highlight
--purple: #a292a3          // Unused
--gray: #6c6a6c            // Muted text
```

---

## Command Handlers

### 1. `neovim`
Displays Neovim configuration details in a table format.
- Manager: lazy.nvim
- Theme: kanagawa-dragon
- LSPs: lua_ls, ts_ls, html, nixd
- Associated tools: lualine, noice, nvim-notify, gitsigns, lazygit, octo, nvim-dap, neotest

**File:** Inline in script section
**Type:** Static display

### 2. `nix`
Shows Nix/Home Manager setup information.
- System: Linux/macOS (cross-platform)
- Shell: fish
- Development tools: nodejs, bun, deno, rustc
- CLI tools: jq, bat, fzf, zoxide, yazi

**File:** Inline in script section
**Type:** Static display

### 3. `wezterm`
Displays WezTerm terminal configuration.
- Config: Lua-based (modular)
- Theme: kanagawa (custom palette)
- Keyboard shortcuts for splits, focus, tabs, fullscreen
- IME support (Japanese input)

**File:** Inline in script section
**Type:** Static display

### 4. `X`
Direct link to X/Twitter profile: `https://x.com/@NazozoK6519`

**File:** Inline in script section
**Type:** Link

### 5. `github`
**Most Complex Command** - Fetches live data from GitHub API:
1. User profile info (name, bio, public repos, followers, following)
2. All public repositories
3. Commit count for each repo (using Link header pagination)
4. Top 3 repositories by commit count
5. Links to full GitHub profile

**API Calls:**
- `GET /users/nazozokc` → User profile
- `GET /users/nazozokc/repos?per_page=100` → Repository list
- `GET /repos/nazozokc/{repo}/commits?per_page=1` → Commit pagination

**Limitations:**
- GitHub API rate limit: 60 requests/hour (unauthenticated)
- No auth token included (public data only)
- Slow on first load (multiple sequential API calls)

**Potential Improvements:**
- Cache results in localStorage
- Use authenticated requests (higher rate limits)
- Parallelize API calls with Promise.all()
- Add error handling for rate limiting

### 6. `:q`
Clears the terminal and reinitializes it (vim-style quit + reload).

**File:** `handleQuit()` function
**Behavior:** Clears output, calls `initTerminal()`, resets to initial state

### 7. `clear`
Simple terminal clear command.

**File:** `handleClear()` function
**Behavior:** Sets `terminal.innerHTML = ""`

---

## JavaScript Functions

### Initialization
- **`initTerminal()`** - Runs on page load and after `:q` command
  - Displays whoami → nazozokc
  - Displays about.txt (3 lines)
  - Displays ls skills/ (skill tags)
  - Fetches and displays top 6 repositories
  - Adds "select command from below" message

### Output Rendering
- **`createOutputLine(content, className)`** - Creates and appends div with animation
- **`typeText(text, element, speed)`** - Simulates typing effect (char-by-char)
- **`appendLines(lines, delay)`** - Types multiple lines with delays between them
- **`scrollToBottom()`** - Smooth scroll (with fallback for older browsers)

### Command Execution
- **`executeCommand(cmd)`** - Main router; displays prompt + delegates to handler
- **`handleNeovim()`, `handleNix()`, `handleWezterm()`, `handleGithub()`** - Individual command handlers

### Utilities
- **`escapeHtml(text)`** - Prevents XSS from dynamic content (GitHub data)
- **`sleep(ms)`** - Promise-based delay
- **`displayBackTop()`** - Creates "back to top" button (defined but unused)

---

## Known Issues & Improvement Opportunities

### Performance
1. **GitHub API calls are sequential** - Top 6 repos load fine, but commit counting is slow
   - Fix: Parallelize with Promise.all()
   
2. **No caching** - Every page reload fetches fresh data
   - Fix: Store in localStorage with TTL

3. **Marked.js is loaded but never used**
   - Fix: Remove from CDN link if not needed

4. **typeText() is slow for long content**
   - Option: Reduce typing speed or batch render

### Reliability
1. **No GitHub auth token** - Vulnerable to rate limiting
   - Fix: Add personal access token (but keep it secret)

2. **Error handling is minimal** - Generic "error: failed to load github info" message
   - Fix: Show specific error (rate limited vs network error)

3. **Responsive design** - Mobile might show horizontal scroll
   - Test on smaller screens; media query exists but may need tweaks

### UX
1. **Back to top button** (`displayBackTop()`) is created but never called
   - Decide: Keep it or remove it?

2. **No loading states for static commands** (neovim, nix, wezterm)
   - Option: Add subtle loading spinner if desired

3. **No command history** or autocomplete
   - Option: Add arrow key navigation through history

4. **Cursor blink animation** only shows in input field
   - Consider: Match cursor appearance to terminal theme

---

## Common Modifications

### Add a New Command
1. Add click-item in HTML:
```html
<div class="click-item" data-cmd="mycommand">
  <span class="click-num">[8]</span>
  <span class="click-cmd">mycommand</span>
</div>
```

2. Add case in `executeCommand()` switch:
```javascript
case "mycommand":
  await handleMyCommand();
  break;
```

3. Implement handler:
```javascript
async function handleMyCommand() {
  await appendLines([
    "line 1",
    "line 2"
  ], 15);
}
```

### Change Colors
Edit `:root` CSS variables:
```css
:root {
  --yellow: #new_color;  // Change highlight color
  --green: #new_color;   // Change primary accent
}
```

### Update GitHub Info Display
Modify the output in `handleGithub()` function. Key elements:
- `user.name`, `user.bio`, `user.followers`, `user.following`
- `repo.name`, `repo.description`, `repo.html_url`
- `repoCommits` array (sorted by commits)

### Improve Animation Speed
- **Typing speed:** Change `delay` param in `appendLines()` (lower = faster)
- **Fade-in animation:** Adjust `0.4s` in `.output-line` animation CSS
- **Scroll behavior:** Modify `behavior: 'smooth'` in `scrollToBottom()`

---

## Testing Checklist

When making changes:
- [ ] Test all 7 commands (including error case with invalid command)
- [ ] Check GitHub API loading (may be slow, test rate limiting)
- [ ] Verify responsive design on mobile (< 640px)
- [ ] Check terminal scrolling behavior
- [ ] Test keyboard input (Enter to submit)
- [ ] Verify click-to-execute buttons work
- [ ] Check color scheme contrast for readability
- [ ] Test on different browsers (Chrome, Firefox, Safari)

---

## Resources

**External APIs:**
- GitHub REST API: `https://api.github.com`
- Google Fonts (JetBrains Mono): `https://fonts.googleapis.com`

**Libraries:**
- Marked.js: `https://cdn.jsdelivr.net/npm/marked/marked.min.js` (currently unused)

**File References:**
- None (single-file HTML application)

---

## Next Steps for User

1. **Specific Issue?** - Describe the problem (UI bug, API issue, styling)
2. **Feature Request?** - Specify what you want to add and where
3. **Performance Issue?** - Profile the slow command (likely GitHub API)
4. **Design Change?** - Show the desired look or modify colors directly

Always ask: What's the current behavior vs. expected behavior?
