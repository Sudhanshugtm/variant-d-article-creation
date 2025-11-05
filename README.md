# Variant D: Inline Section Cards - Wikipedia Article Creation Prototype

A mobile-first article creation interface with category selection, section templates, and contextual guidance.

## 🌐 Live Demo

**👉 [Try it now: https://sudhanshugtm.github.io/variant-d-article-creation/variant-d.html](https://sudhanshugtm.github.io/variant-d-article-creation/variant-d.html)**

> **Note:** It may take 1-2 minutes for GitHub Pages to build and deploy. If the link doesn't work immediately, please wait a moment and refresh.

## 🎯 Overview

**Variant D** ("Inline Section Cards") is a comprehensive Wikipedia article creation prototype featuring:

- **Slash-command entry** (`/`) to trigger article category selection
- **Comprehensive taxonomy** with 12 main topics, 60+ subcategories, and granular article types
- **Bottom sheet modals** for mobile-friendly browsing
- **Specialized templates** for different article types (e.g., cricket players, Olympic athletes, tech platforms)
- **Real Wikipedia examples** showing actual article excerpts
- **Inline section insertion** with contextual guidance and citation prompts
- **Type-specific recommended sources** for citations

## 📁 Files Included

```
variant-d-standalone/
├── variant-d.html        # Main HTML file
├── variant-d.css         # Styling (39KB)
├── variant-d.js          # Main logic (105KB)
├── chrome.css            # Wikipedia VE chrome styling
├── chrome.js             # Toolbar interactions
├── icons.js              # Codex icon utilities
├── shared-data.js        # Legacy article type data
└── README.md             # This file
```

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `variant-d.html` in a modern browser (Chrome, Firefox, Safari).

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python3 -m http.server 8080

# Or using Node.js
npx http-server -p 8080
```

Then visit: `http://localhost:8080/variant-d.html`

## 🎨 Key Features

### 1. Category Selection
- Type `/` in the editor to open category selector
- Search across all categories and subcategories
- Accordion-style navigation with expandable granular types
- Example: People → Athletes → Cricket players in major league

### 2. Article Templates
Specialized templates for:
- **People**: Athletes (Cricket/Olympic/General), Musicians, Scientists, etc.
- **Technology**: Software, Social Media Platforms, Websites
- **Culture**: Films, Music Albums, Arts
- **Geography**: Cities, Countries, Landmarks
- And 8+ more categories!

### 3. Section Guidance
Each section includes:
- Category-specific placeholder text
- Inline guidance boxes with requirements
- "See example" button showing real Wikipedia excerpts
- "Add citation" button with recommended sources

### 4. Citation Dialog
- Type-specific recommended sources (e.g., ESPNCricinfo for cricket)
- Search/paste URL functionality
- Warning about unreliable sources
- Mobile-optimized bottom sheet interface

## 🏗️ Architecture

### Data Structures

**SECTION_TEMPLATES**: 15+ specialized templates with:
- Introduction templates with placeholders
- Section lists (6-8 sections per type)
- Section-specific guidance
- Wikipedia notability guidelines

**RECOMMENDED_SOURCES**: Curated sources by article type:
- Cricket: ESPNCricinfo, IPL Official, Wisden, BBC Sport Cricket
- Olympic: Olympics.com, World Athletics, Olympic Channel
- Tech: TechCrunch, The Verge, Wired, Ars Technica
- Music: AllMusic, Rolling Stone, Billboard, Pitchfork

**SECTION_EXAMPLES**: Real Wikipedia article excerpts for:
- Introduction, Early life, Career, Personal life
- Playing style, Statistics, Awards
- And more...

### Key Functions

- `openCategorySelector()` - Opens category selection bottom sheet
- `selectGranularType()` - Handles granular type selection (e.g., cricket players)
- `insertSection()` - Creates editable section with guidance
- `openExamplesSheet()` - Shows real Wikipedia examples
- `openCitationDialog()` - Opens citation interface with recommended sources

## 🎯 User Flow

1. **Start**: User types `/` in canvas
2. **Select Category**: Browse or search for article type
3. **Template Loads**: Category-specific sections appear
4. **Add Sections**: Click sections to insert into article
5. **Write Content**: Inline editing with guidance
6. **See Examples**: Click lightbulb icon for real examples
7. **Add Citations**: Click reference icon for citation dialog
8. **Publish**: Submit button in toolbar

## 🎨 Design Principles

- **Mobile-first**: Bottom sheets, touch-friendly targets (44px+)
- **Progressive disclosure**: Start simple (`/`), reveal complexity gradually
- **Contextual guidance**: Templates and examples specific to article type
- **Trust-building**: Real Wikipedia examples demonstrate quality
- **Minimal friction**: Inline editing, no page navigation

## 🔧 Technical Details

### Dependencies
- **Codex Design System** (CDN): `@wikimedia/codex@2.3.0`
- Modern browser with ES6 module support
- No build tools required

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

### Performance
- **Debounced search**: 300ms delay for smooth typing
- **Lazy rendering**: Category content rendered on-demand
- **CSS transitions**: Smooth 300ms animations
- **Lightweight**: No heavy frameworks, vanilla JavaScript

## 📱 Mobile Optimizations

- Prevents iOS zoom with `font-size: 16px` on inputs
- Touch-friendly 44px minimum hit areas
- Bottom sheet pattern (familiar mobile paradigm)
- Backdrop overlays for modal context
- Responsive accordion navigation

## ♿ Accessibility

- ARIA labels on interactive elements
- Role attributes for semantic meaning
- Keyboard navigation support (tabindex)
- Focus management after section insertion
- Screen reader friendly structure

## 🎓 Usage Examples

### For Cricket Players
1. Type `/` → Select "People" → "Athletes" → "Cricket players in major league"
2. Template loads with cricket-specific sections
3. Introduction guidance: "Full name, date of birth, playing role, major league teams"
4. Citation dialog shows: ESPNCricinfo, IPL Official, Wisden, etc.

### For Social Media Platforms
1. Type `/` → Select "Technology" → "Internet & Web" → "Social media platforms"
2. Template loads with sections: History, Features, User base, Business model, Reception
3. Citation dialog shows: TechCrunch, The Verge, Wired, Ars Technica

## 📝 Notes

- This is a **prototype** for user testing, not production code
- Templates use placeholder data and mock recommended sources
- Citation insertion is simulated (shows alert in demo)
- No actual Wikipedia API integration

## 🤝 Contributing

This is a research prototype. For questions or feedback, please contact the Wikipedia Article Creation team.

## 📄 License

Part of the Wikipedia Article Creation research project.

---

**Version**: Variant D - Inline Section Cards
**Last Updated**: November 2024
**Prototype Type**: Mobile-first article creation interface
