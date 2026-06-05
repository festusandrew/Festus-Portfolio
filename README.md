# Festus Andrew Portfolio — Developer & Architecture Guide

Welcome to the documentation for the **Festus Andrew Portfolio**, a high-fidelity, premium custom personal website. 

This project is built using semantic HTML5, custom Vanilla CSS, and modern interactive Vanilla JavaScript. It is configured to run locally on a high-performance developer server (Vite) and is pushed to Git version control.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation
Clone the repository and install the development dependencies:
```bash
# Clone the repository
git clone https://github.com/festusandrew/Festus-Portfolio.git
cd Festus-Portfolio

# Install development dependencies
npm install
```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
Once started, open [http://localhost:5173/](http://localhost:5173/) in your web browser. Any changes made to `index.html`, `style.css`, or `app.js` will immediately trigger a Hot Module Replacement (HMR) update.

---

## 📂 Project Architecture

```
Festus-Portfolio/
│
├── .gitignore              # Source control exclusions (ignores node_modules, etc.)
├── package.json            # Vite scripts & devDependencies
├── package-lock.json       # Dependency tree lockfile
│
├── index.html              # Main HTML structures & layout templates
├── style.css               # Core design tokens, theme styles, & transitions
├── app.js                  # Custom cursor, navigation, form transitions & pagination
└── favicon.png             # Custom solid white high-contrast favicon
```

---

## 💎 Features & Implementation Details

### 1. Theme Toggle System (Light & Dark Mode)
* **Default Mode:** Dark mode is set as the absolute primary default, ignoring OS system-level preferences (`prefers-color-scheme`) to maintain the brand's dark aesthetic.
* **Early Head Injection:** An inline theme-detection script runs in the `<head>` of [index.html](index.html) before elements render. This prevents visual flashes of unstyled theme layouts if a visitor prefers the light theme.
* **Sliding Toggle Switch:** Next to the **Let's Talk** button in the floating header, a custom pill button (`.theme-switch`) contains both Sun and Moon icons. A circular handle (`.switch-handle`) slides between them on toggle, transitioning from neon orange (dark mode) to lime green (light mode).
* **Persistent Preferences:** The user's selection is saved in `localStorage` under the key `theme`.

### 2. Spacing & Layout Tuning
* **Tighter Header Spacing:** The vertical space between the avatar/name metadata (`.profile-header`) and the main title (`.hero-main-title`) inside the hero card has been reduced by setting the margin-bottom to `16px` (down from `40px`) to establish a tighter visual relationship.
* **Socials & Resume CTA:** A row of social media icons (LinkedIn, GitHub, Dribbble) and a **Download Resume** button has been added directly underneath the hero description. Hovering over the social buttons triggers a scaling micro-animation and colors them with the brand's accent orange.

### 3. Recent Projects Pagination
* **Mock Expansion:** Staged **6 projects** total to make pagination useful.
* **Dynamic Chunking:** The pagination system splits the grid into pages of **3 projects each**.
* **Navigation Controls:** A right-aligned pagination bar (`.pagination-container` using `justify-content: flex-end`) displays previous/next buttons and numbered page links.
* **Transition Physics:** Switching pages triggers a subtle slide-up and fade-in entry animation (`translateY(12px)`) on the card grids.
* **Scrollspy Integration:** Changing pages scrolls the browser viewport smoothly back to the top of the `#projects` section (with an offset header buffer).
* **Disabled States:** Previous and Next buttons automatically disable at page boundaries.
* **Disabled Redirection:** Project cards have been converted to static container tags (`<div>`) and styled with `cursor: pointer` to disable link redirection while maintaining hover state cursor physics.

### 4. Brand Logo Optimization
* **Natural Crop:** Removed circular masks (`border-radius: 50%`) and borders from `.brand-avatar` so the logo is displayed in its original design aspect ratio.
* **Dynamic Contrast Inversion:**
  * **Dark Mode:** Applies a CSS filter (`filter: invert(1)`) to turn the black logo into crisp white, making it visible against the dark header.
  * **Light Mode:** Restores the filter (`filter: none`), displaying the logo in its original black color for high legibility against the light cream header.

### 5. Desktop Trailing Custom Cursor
* **Touch Filtering:** Detects touch/mobile devices to gracefully disable and hide the cursor coordinates.
* **Physics Trailing:** A custom cursor dot instantly follows the mouse cursor, while a larger outer glow circle uses linear interpolation (lerp) to trail smoothly behind.
* **Hover Interaction:** Changes colors and scales up when hovering over links, buttons, select menus, input tags, textareas, and portfolio/blog cards.

---

## 🎨 Theme Variables (Design Tokens)

Custom properties are defined on `:root` and overridden on `html.light-mode`:

| Design Token | Dark Mode Value | Light Mode Value |
| :--- | :--- | :--- |
| `--bg-color` | `#151312` (Dark Charcoal) | `#f7f6f3` (Warm Cream-Grey) |
| `--bg-card` | `#1c1a19` (Brown-Grey) | `#ffffff` (Pure White) |
| `--bg-card-hover` | `#232120` (Lighter Grey) | `#efeee9` (Warm Grey) |
| `--text-primary` | `#ffffff` (White) | `#151312` (Dark Charcoal) |
| `--text-secondary` | `#998f8f` (Muted Grey) | `#5c5552` (Muted Brown-Slate) |
| `--text-muted` | `#6a6b6e` (Faded Grey) | `#8c837e` (Slate-Grey) |
| `--accent-lime` | `#c5ff41` (Neon Lime) | `#669c00` (Readability Lime-Green) |
| `--accent-orange` | `#f46c38` (Vibrant Orange) | `#d94e18` (High-Contrast Orange) |
| `--border-color` | `rgba(255, 255, 255, 0.05)` | `rgba(21, 19, 18, 0.08)` |
| `--border-hover` | `rgba(197, 255, 65, 0.3)` | `rgba(217, 78, 24, 0.3)` |

---

## 📡 Version Control & Synchronization

All code revisions are version-tracked:
* **Remote Repository:** [Festus-Portfolio Git Repo](https://github.com/festusandrew/Festus-Portfolio)
* **Production Branch:** `main`
* **Commit Messages:** Following descriptive summary structures outlining feature scope changes.
