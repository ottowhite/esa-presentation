# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A reveal.js presentation. Edit `index.html` to create slides. Run `npm start` to preview with live reload on port 8000.

## Previewing Your Work

**Important:** When editing slides, use the Playwright MCP tools to visually verify your changes:

1. Ensure the dev server is running (`npm start`)
2. Use `mcp__playwright__browser_navigate` to open `http://localhost:8000`
3. Use `mcp__playwright__browser_screenshot` to capture and inspect the current slide
4. Use `mcp__playwright__browser_press_key` with "ArrowRight"/"ArrowLeft" to navigate between slides

Always preview slides after making changes to verify layout, styling, and content appear correctly.

## Slide Structure

```html
<div class="reveal">
  <div class="slides">
    <section>Horizontal slide</section>
    <section>
      <section>Vertical slide 1</section>
      <section>Vertical slide 2</section>
    </section>
  </div>
</div>
```

## Fragments (Step-by-Step Reveals)

```html
<p class="fragment">Appears first</p>
<p class="fragment fade-in-then-out">Appears then disappears</p>
<p class="fragment fade-left">Slides in from left</p>
```
Fragment styles: `fade-in`, `fade-out`, `fade-up`, `fade-down`, `fade-left`, `fade-right`, `fade-in-then-out`, `highlight-red`, `highlight-blue`, `highlight-green`

## Backgrounds

```html
<section data-background="#ff0000">Color</section>
<section data-background="image.png">Image</section>
<section data-background-video="video.mp4">Video</section>
<section data-background-iframe="https://example.com" data-background-interactive>Interactive iframe</section>
<section data-background-gradient="linear-gradient(to bottom, #283b95, #17b2c3)">Gradient</section>
```
Image options: `data-background-size`, `data-background-repeat`, `data-background-position`

## Transitions

Per-slide: `data-transition="slide|fade|convex|concave|zoom|none"`
Directional: `data-transition="zoom-in fade-out"` or `data-transition="convex-in concave-out"`

## Auto-Animate

Smoothly animates between slides. Match elements using `data-id`:
```html
<section data-auto-animate>
  <h1 data-id="title">Hello</h1>
  <div data-id="box" style="width: 100px; height: 100px; background: cyan;"></div>
</section>
<section data-auto-animate>
  <h1 data-id="title" style="color: red;">Hello</h1>
  <div data-id="box" style="width: 200px; height: 200px; background: magenta; border-radius: 100px;"></div>
</section>
```
Options: `data-auto-animate-easing`, `data-auto-animate-delay`, `data-auto-animate-unmatched="fade"`

## Layout Helpers

- `class="r-fit-text"` - Scales text to fill container
- `class="r-stretch"` - Stretches element to fill remaining slide height
- `class="r-stack"` - Stacks elements on top of each other (use with fragments)
- `class="r-hstack"` - Horizontal stack
- `class="r-vstack"` - Vertical stack

## Code Blocks

```html
<pre><code data-trim data-line-numbers class="language-javascript">
function hello() {
  return "world";
}
</code></pre>
```
- `data-trim` - Removes leading/trailing whitespace
- `data-line-numbers` - Shows line numbers
- `data-line-numbers="1|3-5"` - Highlights lines progressively as fragments
- `data-line-numbers="287: 2|4,6"` - Custom starting line number

## Math (LaTeX)

Inline: `\(E = mc^2\)`
Block: `\[E = mc^2\]`

Requires RevealMath plugin: `plugins: [ RevealMath.KaTeX ]` (or MathJax2/MathJax3)

## Markdown Slides

Inline markdown:
```html
<section data-markdown>
  <script type="text/template">
    ## Slide Title
    - Bullet point
    - Another point
  </script>
</section>
```

External markdown file:
```html
<section data-markdown="slides.md" data-separator="^\n---\n$" data-separator-vertical="^\n--\n$"></section>
```

Slide/element attributes in markdown:
```markdown
<!-- .slide: data-background="#000" -->
## Title
- Item <!-- .element: class="fragment" -->
```

## Media

```html
<video src="video.mp4" data-autoplay></video>
<audio src="audio.wav" data-autoplay></audio>
<iframe data-autoplay width="700" height="400" src="https://example.com"></iframe>
```

## Preview/Lightbox

```html
<img src="thumb.png" data-preview-image>
<img src="thumb.png" data-preview-image="fullsize.png">
<video src="video.mp4" data-preview-video></video>
<a href="https://example.com" data-preview-link>Preview in overlay</a>
```

## Speaker Notes

```html
<section>
  Slide content
  <aside class="notes">Speaker notes here (press 'S' to view)</aside>
</section>
```

In markdown: `Note: Speaker notes here`

## Themes

Available in `dist/theme/`: black, white, beige, blood, dracula, league, moon, night, serif, simple, sky, solarized, black-contrast, white-contrast

## Configuration

```javascript
Reveal.initialize({
  hash: true,              // Enable URL hashes for slides
  controls: true,          // Show navigation arrows
  progress: true,          // Show progress bar
  center: true,            // Vertically center slides
  transition: 'slide',     // none/fade/slide/convex/concave/zoom
  view: 'scroll',          // Enable scroll view mode
  plugins: [ RevealMarkdown, RevealHighlight, RevealNotes, RevealMath.KaTeX ]
});
```

## Available Plugins

- `RevealMarkdown` - Markdown support
- `RevealHighlight` - Syntax highlighting
- `RevealNotes` - Speaker notes
- `RevealMath.KaTeX` / `RevealMath.MathJax2` / `RevealMath.MathJax3` - LaTeX math
- `RevealZoom` - Alt+click zoom
- `RevealSearch` - Slide search (Ctrl+Shift+F)
