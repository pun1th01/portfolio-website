# Portfolio Website

Personal portfolio website for Punith P — frontend developer focused on real-time 3D web experiences, Minecraft modding, and interactive UI.

**Live Site:** [pun1th01.github.io/portfolio-website](https://pun1th01.github.io/portfolio-website/)

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Canvas API

## Features

- Responsive design for desktop and mobile viewports
- Animated pixel art night city background with parallax scrolling (Canvas API)
- Dynamic weather system — rain with lightning effects
- Shooting stars, nebulae, and moon with crescent shadow
- Sticky navigation with scroll-based active section highlighting
- Hamburger menu on mobile
- Smooth scrolling between sections
- Project showcase with Completed/WIP status indicators
- Project details modal and sneak peek image/video carousel
- Resume download
- Custom 404 page for GitHub Pages
- SEO metadata (Open Graph, Twitter Cards, canonical URL)

## Click-to-Source 3D — Project Page

A dedicated engineering project page is available at [`pages/click-to-source-3d.html`](pages/click-to-source-3d.html).

### Page Sections

1. **Hero** — Title, active development badge, description, CTA buttons
2. **Overview** — Problem / Current Solutions / My Solution cards
3. **Progress** — Stage completion tracker (5 stages)
4. **Documentation** — Dynamically generated PDF document cards (main feature)
5. **Gallery** — Responsive media grid (images, videos, GIFs)
6. **Technical Highlights** — Feature cards (Three.js, AST Analysis, etc.)
7. **Development Timeline** — Vertical timeline with milestones
8. **Roadmap** — Checklist with upcoming milestones

### Documentation System

All Click-to-Source 3D documentation PDFs are stored in:

```
assets/documents/click-to-source-3d/
```

The document cards on the project page are **generated dynamically** from a centralized data file:

```
js/click-to-source-data.js
```

**To add a new document:**

1. Place the PDF file in `assets/documents/click-to-source-3d/`
2. Open `js/click-to-source-data.js`
3. Add an object to the `documents` array:

    ```javascript
    {
      title: "Document Title",
      description: "Brief description of the document.",
      stage: 2,
      file: "Your_Document_Filename.pdf",
      completed: true
    }
    ```

4. The project page will automatically render a new card with View and Download buttons.

No HTML changes are required. The page reads the data array and builds all cards at runtime.

## Run Locally

1. Clone the repository:

    ```bash
    git clone https://github.com/pun1th01/portfolio-website.git
    cd portfolio-website
    ```

2. Start a local static server from the project root:

    ```bash
    python -m http.server 5500
    ```

3. Open [http://127.0.0.1:5500/](http://127.0.0.1:5500/)

## Folder Structure

```text
PortfolioWebsite/
├── .nojekyll
├── 404.html
├── index.html
├── README.md
│
├── assets/
│   ├── icons/
│   │   └── favicon.svg
│   │
│   ├── images/
│   │   ├── profile/
│   │   │   └── MyNewPFP.png
│   │   └── world-generator/
│   │       ├── worldgen-sneakpeek-01.png
│   │       ├── ...
│   │       └── worldgen-sneakpeek-35.png
│   │
│   ├── videos/
│   │   └── world-generator/
│   │       ├── Noise_Terrain.mp4
│   │       └── Noise_Terrain_2.mp4
│   │
│   ├── documents/
│   │   ├── resume/
│   │   │   └── Punith P - Resume.pdf
│   │   └── click-to-source-3d/
│   │       ├── Click-to-Source_Final_Approach.pdf
│   │       ├── Click-to-Source_Project_Proposal.pdf
│   │       ├── Click-to-Source_Tech_Stack.pdf
│   │       ├── Click-to-Source_Technical_Approaches.pdf
│   │       ├── Stage1_Experimental_Report.pdf
│   │       └── experimentResults.txt
│   │
│   └── thumbnails/
│       └── click-to-source-3d/
│
├── css/
│   ├── main.css              ← Portfolio page styles
│   ├── project.css            ← Shared project page layout
│   └── documentation.css      ← Document card styles
│
├── js/
│   ├── main.js                ← Portfolio page logic (city background, modals, carousel)
│   ├── click-to-source-data.js ← Centralized data (documents, timeline, roadmap, etc.)
│   └── documentation.js       ← Dynamic UI rendering for project pages
│
└── pages/
    └── click-to-source-3d.html ← Click-to-Source 3D project page
```

## Maintenance Notes

- Resume file path: `assets/documents/resume/Punith P - Resume.pdf`
- Profile image: `assets/images/profile/MyNewPFP.png`
- World generator screenshots: `assets/images/world-generator/`
- World generator videos: `assets/videos/world-generator/`
- Click-to-Source 3D documentation: `assets/documents/click-to-source-3d/`
- To add more sneak peek images, continue the naming pattern: `worldgen-sneakpeek-36.png`, etc.
- To add Click-to-Source 3D gallery media, place files in `assets/images/click-to-source-3d/` or `assets/videos/click-to-source-3d/` and add an entry to the `gallery` array in `js/click-to-source-data.js`.
- All asset paths are relative for GitHub Pages compatibility.

## License

This is a personal portfolio project. No license file is currently included.

## Connect

- [GitHub](https://github.com/pun1th01)
- [LinkedIn](https://www.linkedin.com/in/punith-p-b5239b28a/)