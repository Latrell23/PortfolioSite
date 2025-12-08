# Portfolio Site Documentation

## Overview

This portfolio site is built with **React + Vite** and features a unique OS-like window system where each navigation item opens a draggable window with optional popups. The design uses glassmorphism, smooth animations, and a cohesive color scheme.

---

## Project Structure

```
src/
├── assets/                  # Static assets
│   ├── fonts/              # Custom fonts (Josefin)
│   ├── projects/           # Project screenshots
│   │   └── studentprayer/  # Student Prayer app images
│   ├── resume/             # Resume PDF
│   ├── memphis.png         # Memphis cityscape image
│   ├── signature.png       # Signature overlay
│   └── HeroSectionLoop.mp4 # Background video
├── components/             # Reusable UI components
│   ├── Background.jsx      # Video background
│   ├── DownloadPopup.jsx   # PDF download popup
│   ├── GalleryPopup.jsx    # Image gallery popup
│   ├── LinkPopup.jsx       # Social links popup
│   ├── NavBar.jsx          # Navigation menu
│   ├── Popup.jsx           # Polaroid image popup
│   ├── Screen.jsx          # Main screen container
│   └── Window.jsx          # Draggable window component
├── pages/                  # Page content components
│   ├── About.jsx           # About me content
│   ├── Contact.jsx         # Contact form
│   ├── Projects.jsx        # Projects showcase
│   └── Resume.jsx          # Resume display
├── App.jsx                 # Main application component
├── App.css                 # All styles
└── main.jsx               # Entry point
```

---

## Core Components

### 1. App.jsx

**Purpose:** Main application component that manages window states and configurations.

**Key Concepts:**
- Uses `pageConfig` object to define each page's component and associated popups
- Manages open/closed state for all windows

**State:**
```javascript
const [openWindows, setOpenWindows] = useState({})
// Example: { About: true, Projects: false, Resume: false, Contact: false }
```

**Functions:**
| Function | Description |
|----------|-------------|
| `handleNavClick(pageName)` | Opens a window by setting its state to `true` |
| `handleCloseWindow(pageName)` | Closes a window by setting its state to `false` |

**Page Configuration:**
```javascript
const pageConfig = {
  PageName: {
    component: <Component />,    // The page content component
    popup: { ... } | null,       // Polaroid-style image popup
    linkPopup: { ... } | null,   // Social links popup
    downloadPopup: { ... } | null, // File download popup
    galleryPopup: { ... } | null   // Multi-image gallery popup
  }
}
```

---

### 2. Window.jsx

**Purpose:** Reusable draggable window container that displays page content and manages associated popups.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Controls visibility |
| `onClose` | function | Callback when close button clicked |
| `title` | string | Window header title |
| `children` | ReactNode | Page content to display |
| `popup` | object \| null | Polaroid popup config |
| `linkPopup` | object \| null | Link popup config |
| `downloadPopup` | object \| null | Download popup config |
| `galleryPopup` | object \| null | Gallery popup config |

**Hooks Used:**
- `useState` - Position, dragging state, drag offset
- `useEffect` - Center window on open, handle mouse events
- `useRef` - Reference to window DOM element

**State:**
```javascript
const [position, setPosition] = useState({ x: 100, y: 100 })
const [isDragging, setIsDragging] = useState(false)
const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
```

**Functions:**
| Function | Description |
|----------|-------------|
| `handleMouseDown(e)` | Initiates dragging, calculates offset from click position |
| `handleMouseMove(e)` | Updates position while dragging, respects viewport bounds |
| `handleMouseUp()` | Ends dragging state |

**Drag Logic:**
1. On `mousedown` in header: Calculate offset between mouse and window position
2. Add `mousemove` and `mouseup` listeners to document
3. On `mousemove`: Update position relative to mouse minus offset
4. Clamp position to keep window within viewport
5. On `mouseup`: Remove listeners and reset dragging state

---

### 3. Popup.jsx

**Purpose:** Draggable Polaroid-style image popup.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Controls visibility |
| `imageSrc` | string | Image source URL |
| `alt` | string | Image alt text / caption |
| `initialPosition` | object | Starting `{ x, y }` position |

**Hooks Used:**
- `useState` - Position, dragging state, drag offset
- `useEffect` - Reset position when opened, handle mouse events
- `useRef` - Reference to popup DOM element

**Visual Features:**
- Off-white gradient background (like real Polaroid paper)
- Thick bottom padding for caption area
- Subtle paper texture overlay
- Slight rotation (-2deg) that straightens on hover
- Handwritten-style font for caption

---

### 4. LinkPopup.jsx

**Purpose:** Draggable popup displaying social media links with icons.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Controls visibility |
| `links` | array | Array of link objects |
| `initialPosition` | object | Starting `{ x, y }` position |

**Link Object Structure:**
```javascript
{
  type: 'github' | 'linkedin',  // Determines icon
  label: 'GitHub',               // Display text
  url: 'https://...'            // Link URL
}
```

**Hooks Used:**
- `useState` - Position, dragging state, drag offset
- `useEffect` - Reset position when opened, handle mouse events
- `useRef` - Reference to popup DOM element

**Built-in Icons:**
- GitHub (SVG path)
- LinkedIn (SVG path)

---

### 5. DownloadPopup.jsx

**Purpose:** Draggable popup with file preview and download button.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Controls visibility |
| `file` | object | File configuration |
| `initialPosition` | object | Starting `{ x, y }` position |

**File Object Structure:**
```javascript
{
  src: importedFile,           // Imported file reference
  name: 'filename.pdf'         // Display filename
}
```

**Hooks Used:**
- `useState` - Position, dragging state, drag offset
- `useEffect` - Reset position when opened, handle mouse events
- `useRef` - Reference to popup DOM element

**Features:**
- Document icon with download arrow
- Filename display (truncated if too long)
- File type label
- Download button that triggers native download

---

### 6. GalleryPopup.jsx

**Purpose:** Draggable image carousel for displaying multiple project screenshots.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | boolean | Controls visibility |
| `images` | array | Array of image objects |
| `initialPosition` | object | Starting `{ x, y }` position |

**Image Object Structure:**
```javascript
{
  src: importedImage,  // Imported image reference
  alt: 'Screen Name'   // Caption text
}
```

**Hooks Used:**
- `useState` - Position, dragging, drag offset, currentIndex
- `useEffect` - Reset position/index when opened, handle mouse events
- `useRef` - Reference to popup DOM element

**State:**
```javascript
const [currentIndex, setCurrentIndex] = useState(0)
```

**Functions:**
| Function | Description |
|----------|-------------|
| `goNext()` | Advances to next image (loops to start) |
| `goPrev()` | Goes to previous image (loops to end) |

**Features:**
- Navigation arrows (left/right)
- Dot indicators for current position
- Click on dots to jump to specific image
- Caption showing current image name

---

### 7. NavBar.jsx

**Purpose:** Navigation menu that triggers window opens.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `onNavClick` | function | Callback when nav item clicked |

**Structure:**
```javascript
const navItems = ['About', 'Projects', 'Resume', 'Contact']
```

**Behavior:**
- Maps over `navItems` array
- Each item calls `onNavClick(itemName)` when clicked
- CSS handles hover underline animation

---

### 8. Background.jsx

**Purpose:** Full-screen looping video background.

**Implementation:**
```jsx
<div className="os-background">
  <video autoPlay muted loop playsInline className="os-video">
    <source src={videoSrc} type="video/mp4" />
  </video>
</div>
```

**Attributes:**
- `autoPlay` - Starts automatically
- `muted` - Required for autoplay
- `loop` - Continuous playback
- `playsInline` - Prevents fullscreen on mobile

---

### 9. Screen.jsx

**Purpose:** Container component that wraps all page content.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `children` | ReactNode | Content to display |

**Simple wrapper providing layout structure.**

---

## Page Components

### About.jsx

**Purpose:** Personal biography and background information.

**Structure:**
- Header (About Me)
- Three sections with line breaks
- Left border accent on hover

---

### Contact.jsx

**Purpose:** Contact form that opens user's email client.

**Hooks Used:**
- `useState` - Form data, submission status

**State:**
```javascript
const [formData, setFormData] = useState({
  name: '',
  title: '',
  message: ''
})
const [status, setStatus] = useState('')
```

**Functions:**
| Function | Description |
|----------|-------------|
| `handleChange(e)` | Updates form field in state |
| `handleSubmit(e)` | Creates mailto link and opens email client |

**Email Integration:**
Uses `mailto:` URL with encoded subject and body:
```javascript
const mailtoLink = `mailto:email@example.com?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`From: ${name}\n\n${message}`)}`
```

---

### Projects.jsx

**Purpose:** Showcase of portfolio projects.

**Exports:**
```javascript
export const projectImages = { ... }  // For use in App.jsx
export default function Projects() { ... }
```

**Structure:**
- Project card with header
- Technology tags
- Description
- Features grid with icons
- Tech stack info

---

### Resume.jsx

**Purpose:** Professional resume display.

**Sections:**
- Header (name, title, contact)
- Summary
- Technical Skills (2-column grid)
- Experience (role, company, bullets)
- Education
- Interests

---

## Styling (App.css)

### Design System

**Colors:**
```css
/* Primary accent */
rgb(111, 142, 194)  /* Muted blue */

/* Text colors */
rgba(255, 255, 255, 0.9)  /* Primary text */
rgba(255, 255, 255, 0.7)  /* Secondary text */
rgba(255, 255, 255, 0.5)  /* Muted text */
rgba(255, 255, 255, 0.3)  /* Disabled text */

/* Backgrounds */
rgba(20, 20, 30, 0.85)    /* Window background */
rgba(255, 255, 255, 0.05) /* Subtle highlight */
```

**Typography:**
```css
font-family: "Josefin", system-ui, sans-serif;
```

**Glassmorphism:**
```css
background: rgba(20, 20, 30, 0.85);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Animation Patterns

**Bounce entrance:**
```css
animation: name 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
```

**Smooth transitions:**
```css
transition: all 0.3s ease;
```

---

## Adding New Features

### Adding a New Page

1. Create `src/pages/NewPage.jsx`
2. Import in `App.jsx`
3. Add to `pageConfig`:
```javascript
NewPage: {
  component: <NewPage />,
  popup: null,
  linkPopup: null,
  downloadPopup: null,
  galleryPopup: null
}
```
4. Add to `NavBar.jsx` navItems array

### Adding a New Popup Type

1. Create `src/components/NewPopup.jsx` with drag logic
2. Import in `Window.jsx`
3. Add prop and render condition in Window
4. Add configuration option to `pageConfig`
5. Add CSS styles in `App.css`

---

## Key Patterns

### Drag Implementation Pattern

All draggable components share this pattern:

```javascript
// State
const [position, setPosition] = useState(initialPosition)
const [isDragging, setIsDragging] = useState(false)
const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
const ref = useRef(null)

// Start drag
const handleMouseDown = (e) => {
  setIsDragging(true)
  const rect = ref.current.getBoundingClientRect()
  setDragOffset({
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  })
}

// During drag
const handleMouseMove = (e) => {
  if (!isDragging) return
  setPosition({
    x: Math.max(0, Math.min(e.clientX - dragOffset.x, maxX)),
    y: Math.max(0, Math.min(e.clientY - dragOffset.y, maxY))
  })
}

// End drag
const handleMouseUp = () => setIsDragging(false)

// Effect for global listeners
useEffect(() => {
  if (isDragging) {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  return () => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
}, [isDragging, dragOffset])
```

---

## Build & Development

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
```

**Preview Production:**
```bash
npm run preview
```

---

## Dependencies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

---

*Documentation last updated: December 7, 2025*
