# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A reveal.js presentation. Edit `index.html` to create slides. Run `npm start` to preview with live reload on port 8000.

## Previewing Your Work

**Important:** When editing slides, use the Playwright MCP tools to visually verify your changes:

1. Assume the dev server is running, but you can double check first by seeing what is running on localhost:8000, and if there's nothing, run `npm start`
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

## Images

Place image files in the `assets/` folder and reference them with relative paths:

```html
<!-- Basic image -->
<img src="assets/image.png">

<!-- Image that stretches to fill available slide height -->
<img src="assets/image.png" class="r-stretch">

<!-- Image with explicit dimensions -->
<img src="assets/image.png" width="450" height="300">

<!-- Stacked images that appear sequentially -->
<div class="r-stack">
  <img src="assets/image1.png" width="450" height="300" class="fragment">
  <img src="assets/image2.png" width="450" height="300" class="fragment">
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
- `RevealMermaid` - Mermaid diagram support (installed via npm)

## Animated Diagrams with HTML/CSS (Preferred)

For diagrams that require step-by-step reveals or complex animations, use HTML/CSS boxes with fragments instead of Mermaid. This is the preferred method because:

1. **Full animation control**: Each element can be revealed independently with `class="fragment"`
2. **Auto-animate compatibility**: Elements with `data-id` can smoothly animate position/size across slides
3. **Mermaid limitations**: Mermaid diagrams are rendered as SVG at runtime, which breaks auto-animate matching and prevents granular control over individual elements

### Basic Pattern: Fragments for Sequential Reveal

Use `r-vstack` or `r-hstack` with fragments for stack diagrams where elements appear one at a time in fixed positions:

```html
<section>
  <h3>Architecture Stack</h3>
  <div class="r-vstack" style="gap: 10px;">
    <div class="fragment" style="background: #4a90d9; padding: 20px 60px; border-radius: 8px; color: white; font-weight: bold;">
      Layer 1
    </div>
    <div class="fragment" style="font-size: 24px;">↓</div>
    <div class="fragment" style="background: #2ecc71; padding: 20px 60px; border-radius: 8px; color: white; font-weight: bold;">
      Layer 2
    </div>
    <div class="fragment" style="font-size: 24px;">↓</div>
    <div class="fragment" style="background: #9b59b6; padding: 15px 40px; border-radius: 8px; color: white; font-weight: bold;">
      Layer 3
      <div style="background: #e74c3c; padding: 10px 30px; border-radius: 6px; margin-top: 10px;">
        Nested Component
      </div>
    </div>
  </div>
</section>
```

### Advanced Pattern: Auto-Animate for Position Changes

If you need elements to smoothly move/resize between states, use multiple slides with `data-auto-animate` and matching `data-id` attributes. Note: This requires repeating the full slide structure for each state.

```html
<section data-auto-animate>
  <h3 data-id="title">Stack</h3>
  <div data-id="box1" style="background: #4a90d9; padding: 20px;">Layer 1</div>
</section>
<section data-auto-animate>
  <h3 data-id="title">Stack</h3>
  <div data-id="box1" style="background: #4a90d9; padding: 20px;">Layer 1</div>
  <div data-id="box2" style="background: #2ecc71; padding: 20px;">Layer 2</div>
</section>
```

### When to Use Each Approach

| Approach | Use When |
|----------|----------|
| **Fragments** | Elements appear in fixed positions, no movement needed |
| **Auto-animate** | Elements need to move, resize, or change properties smoothly |
| **Mermaid** | Static diagrams with no animation, or standard diagram types (flowcharts, sequence diagrams) |

### Choosing Colors

Suggested palette for stack diagrams:
- `#4a90d9` - Blue (top layer / client)
- `#2ecc71` - Green (middle layer / framework)
- `#9b59b6` - Purple (lower layer / runtime)
- `#e74c3c` - Red (hardware / nested components)

## Mermaid Diagrams

This project has `reveal.js-mermaid-plugin` installed for rendering diagrams. Use Mermaid for static diagrams or when you need standard diagram types. For animated diagrams, see "Animated Diagrams with HTML/CSS" above.

### Basic Usage

Wrap diagrams in `<div class="mermaid"><pre>...</pre></div>`:

```html
<section>
  <h3>My Diagram</h3>
  <div class="mermaid">
    <pre>
      flowchart TD
        A[Start] --> B[End]
    </pre>
  </div>
</section>
```

### Flowchart

```
flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E
```

Direction options: `TD` (top-down), `TB` (top-bottom), `BT` (bottom-top), `LR` (left-right), `RL` (right-left)

Node shapes:
- `[text]` - Rectangle
- `(text)` - Rounded rectangle
- `([text])` - Stadium/pill shape
- `[[text]]` - Subroutine
- `[(text)]` - Cylinder (database)
- `((text))` - Circle
- `{text}` - Diamond (decision)
- `{{text}}` - Hexagon
- `[/text/]` - Parallelogram
- `[\text\]` - Parallelogram alt
- `[/text\]` - Trapezoid
- `[\text/]` - Trapezoid alt

Arrow types:
- `-->` - Arrow
- `---` - Line
- `-.->` - Dotted arrow
- `==>` - Thick arrow
- `--text-->` - Arrow with label
- `-->|text|` - Arrow with label (alt)

### Sequence Diagram

```
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello Bob
    B-->>A: Hi Alice
    A->>B: How are you?
    B-->>A: Great!
```

Arrow types:
- `->` - Solid line
- `-->` - Dotted line
- `->>` - Solid with arrowhead
- `-->>` - Dotted with arrowhead
- `-x` - Solid with cross
- `--x` - Dotted with cross

Features:
- `Note right of A: Note text` - Add notes
- `loop Loop text ... end` - Loops
- `alt Condition ... else Other ... end` - Conditionals
- `par Parallel 1 ... and Parallel 2 ... end` - Parallel execution
- `activate A` / `deactivate A` - Activation boxes

### Class Diagram

```
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +fetch()
    }
    Animal <|-- Dog
```

Relationships:
- `<|--` - Inheritance
- `*--` - Composition
- `o--` - Aggregation
- `-->` - Association
- `..>` - Dependency
- `..|>` - Realization

Visibility:
- `+` Public
- `-` Private
- `#` Protected
- `~` Package/Internal

### State Diagram

```
stateDiagram-v2
    [*] --> Idle
    Idle --> Processing: Start
    Processing --> Complete: Done
    Processing --> Error: Fail
    Complete --> [*]
    Error --> Idle: Reset
```

Features:
- `[*]` - Start/end state
- `state "Description" as s1` - State with description
- `state fork_state <<fork>>` - Fork
- `state join_state <<join>>` - Join
- `note right of State: Note` - Notes

### Entity Relationship Diagram

```
erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    PRODUCT ||--o{ LINE-ITEM : "is in"
```

Cardinality:
- `||` - Exactly one
- `o|` - Zero or one
- `}|` - One or more
- `o{` - Zero or more

### Gantt Chart

```
gantt
    title Project Schedule
    dateFormat YYYY-MM-DD
    section Planning
    Research     :a1, 2024-01-01, 7d
    Design       :a2, after a1, 5d
    section Development
    Implementation :a3, after a2, 14d
    Testing      :a4, after a3, 7d
```

### Pie Chart

```
pie title Distribution
    "Category A" : 40
    "Category B" : 30
    "Category C" : 20
    "Category D" : 10
```

### Git Graph

```
gitGraph
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
```

### Mind Map

```
mindmap
    root((Central Topic))
        Branch 1
            Sub-topic 1
            Sub-topic 2
        Branch 2
            Sub-topic 3
        Branch 3
```

### Timeline

```
timeline
    title Project Timeline
    2024 : Planning phase
         : Requirements gathering
    2025 : Development
         : Testing
         : Launch
```

### Quadrant Chart

```
quadrantChart
    title Prioritization Matrix
    x-axis Low Effort --> High Effort
    y-axis Low Impact --> High Impact
    quadrant-1 Do First
    quadrant-2 Schedule
    quadrant-3 Delegate
    quadrant-4 Eliminate
    Task A: [0.8, 0.9]
    Task B: [0.3, 0.7]
    Task C: [0.6, 0.3]
```

### Theming

Apply per-diagram themes using directives at the start:

```
%%{init: {'theme': 'dark'}}%%
flowchart TD
    A --> B
```

Available themes: `default`, `dark`, `forest`, `neutral`, `base`

### Tips

1. Keep diagrams simple - split complex diagrams across multiple slides
2. Use `r-stretch` class on the mermaid div to fill available space
3. Test diagrams at https://mermaid.live/ before adding to slides
4. For custom styling, use `%%{init: {...}}%%` directives
