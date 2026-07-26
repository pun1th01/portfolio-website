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
├── assets/
│   ├── icons/
│   │   └── favicon.svg
│   ├── images/
│   │   ├── MyNewPFP.png
│   │   └── world-generator/
│   │       ├── worldgen-sneakpeek-01.png
│   │       ├── ...
│   │       └── worldgen-sneakpeek-35.png
│   ├── resume/
│   │   └── Punith P - Resume.pdf
│   └── videos/
│       └── world-generator/
│           ├── Noise_Terrain.mp4
│           └── Noise_Terrain_2.mp4
├── css/
│   └── main.css
└── js/
    └── main.js
```

## Maintenance Notes

- Resume file path: `assets/resume/Punith P - Resume.pdf`
- World generator screenshots: `assets/images/world-generator/`
- World generator videos: `assets/videos/world-generator/`
- To add more sneak peek images, continue the naming pattern: `worldgen-sneakpeek-36.png`, etc.
- All asset paths are relative for GitHub Pages compatibility.

## License

This is a personal portfolio project. No license file is currently included.

## Connect

- [GitHub](https://github.com/pun1th01)
- [LinkedIn](https://www.linkedin.com/in/punith-p-b5239b28a/)