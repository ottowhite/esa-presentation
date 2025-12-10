# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a reveal.js presentation project (v5.2.1) - an HTML presentation framework. The presentation content is in `index.html`.

## Development Commands

```bash
# Install dependencies (auto-runs via shell.nix)
npm install

# Start dev server with live reload (port 8000)
npm start

# Build for production
npm build

# Run tests (ESLint + QUnit)
npm test

# Using Nix with process-compose for orchestration
nix-shell  # Enters shell and installs deps
process-compose  # Runs the reveal server
```

## Architecture

### Build System
- **Gulp** (`gulpfile.js`) - Orchestrates all build tasks
- **Rollup** - Bundles JS into UMD (`dist/reveal.js`) and ES modules (`dist/reveal.esm.js`)
- **Sass** - Compiles SCSS themes from `css/theme/source/` to `dist/theme/`
- **Babel** - Transpiles JS with preset-env for browser compatibility

### Core Structure
- `js/index.js` - Main entry point, exports Reveal class
- `js/reveal.js` - Core presentation logic
- `js/controllers/` - Modular controllers (keyboard, touch, fragments, etc.)
- `js/utils/` - Utility functions (color, device detection, etc.)

### Plugins (`plugin/`)
Each plugin has `plugin.js` source that builds to both `.js` (UMD) and `.esm.js`:
- **highlight** - Syntax highlighting via highlight.js
- **markdown** - Markdown slide support via marked
- **notes** - Speaker notes view
- **math** - LaTeX support (KaTeX/MathJax)
- **search** - Slide search functionality
- **zoom** - Zoom on Alt+click

### Themes
Theme source files in `css/theme/source/*.scss` compile to `dist/theme/*.css`. Available themes: black, white, beige, blood, dracula, league, moon, night, serif, simple, sky, solarized.

## Presentation Editing

Edit `index.html` to modify slides. Structure:
```html
<div class="reveal">
  <div class="slides">
    <section>Slide content</section>
  </div>
</div>
```

Initialize with plugins in the script tag at bottom of `index.html`.
