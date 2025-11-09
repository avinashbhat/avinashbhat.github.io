# Avinash Bhat - Personal Website (Astro)

This is the Astro version of avinashbhat.github.io, migrated from Jekyll.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:4321

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
/
├── public/              # Static assets (images, PDFs, favicon, etc.)
├── src/
│   ├── components/      # Reusable Astro components
│   │   ├── NewsList.astro
│   │   ├── PublicationsList.astro
│   │   ├── ServiceList.astro
│   │   └── BlogsList.astro
│   ├── data/           # JSON data files
│   │   ├── news.json
│   │   ├── publications.json
│   │   ├── service.json
│   │   └── blogs.json
│   ├── layouts/        # Page layouts
│   │   ├── BaseLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/          # File-based routing
│   │   ├── index.astro       # Redirects to /about
│   │   ├── about.astro       # Main page
│   │   ├── 404.astro
│   │   └── blog/
│   │       └── collaboration-for-quality.md
│   ├── scripts/        # JavaScript files
│   │   ├── main.js           # Tabs + theme toggle
│   │   ├── sidenotes.js      # Modal sidenotes
│   │   └── party-mode.js     # Easter egg
│   └── styles/         # SCSS files
│       └── main.scss
├── astro.config.mjs    # Astro configuration
└── package.json
```

## ✨ Features

- ⚡️ Lightning fast builds with Astro
- 🎨 Dark/light theme toggle
- 📱 Fully responsive design
- 📑 Tabbed interface (News, Publications, Service)
- 🎯 Hover-expandable lists
- 💬 Modal sidenotes
- 🎉 Party mode easter egg (type "party")
- 📊 Google Analytics
- 🔍 SEO optimized
- 📝 Markdown support for blog posts

## 🔄 Migration from Jekyll

This site was migrated from Jekyll to Astro. Key changes:

- **Template syntax**: Liquid → Astro
- **Data format**: YAML → JSON
- **Build tool**: Jekyll/Ruby → Astro/Node
- **All features preserved**: Dark mode, tabs, sidenotes, party mode

## 📝 Updating Content

### Add a news item
Edit `src/data/news.json`:
```json
{
  "date": "January 2025",
  "title": "Your Title",
  "content": "Your content with [markdown](link) support"
}
```

### Add a publication
Edit `src/data/publications.json`:
```json
{
  "title": "Paper Title",
  "authors": "Author 1, Author 2",
  "conference": "Conference Name",
  "year": 2024,
  "link": "url or path",
  "awards": ["Optional Award"]
}
```

### Add a blog post
Create a new `.md` file in `src/pages/blog/`:
```markdown
---
layout: ../../layouts/PageLayout.astro
title: "Your Title"
pageClass: blog-content-page
date: "Month DD, YYYY"
---

Your content here...
```

## 🚢 Deployment

### GitHub Pages

1. Update `.github/workflows/deploy.yml`:
```yaml
- name: Install dependencies
  run: npm ci
- name: Build
  run: npm run build
- name: Deploy
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
```

2. Push to main branch

The site will be built and deployed automatically.

## 🧪 Testing Checklist

- [ ] Home redirects to /about
- [ ] All tabs work (News, Publications, Service)
- [ ] News items expand on hover
- [ ] Publications display correctly
- [ ] Dark mode toggle works
- [ ] Theme persists on refresh
- [ ] Blog post loads
- [ ] Mobile responsive
- [ ] Party mode (type "party")

## 📦 Dependencies

- **astro**: Static site builder
- **@astrojs/sitemap**: Automatic sitemap generation
- **astro-compress**: HTML/CSS/JS compression
- **marked**: Markdown processing
- **sass**: SCSS compilation

## 🆚 Comparison with Jekyll

| Feature | Jekyll | Astro |
|---------|--------|-------|
| Build time | ~5s | ~2s |
| Dev server | Slow | Instant HMR |
| Node/Ruby | Ruby | Node.js |
| Template | Liquid | Astro/JSX |
| Data | YAML | JSON |

## 📄 License

All Rights Reserved © Avinash Bhat {new Date().getFullYear()}
