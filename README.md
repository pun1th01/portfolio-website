# Portfolio Website

Personal portfolio website focused on frontend development and real-time 3D web experiences.

Live Site: https://pun1th01.github.io/portfolio-website/

## Overview

This project is a static site built with HTML, CSS, and vanilla JavaScript. It highlights projects, skills, links, and contact details with an interactive project modal system.

## Features

- Responsive layout for desktop and mobile
- Sticky navigation with active section highlight
- Smooth scrolling between sections
- Resume download button
- Projects section with Completed and WIP indicators
- Project details modal for the Time Sync Environment
- Sneak Peek modal for the Procedural World Generator
- Sneak Peek image carousel with previous/next controls
- Sneak Peek dot indicators
- Sneak Peek keyboard navigation (Left/Right arrows)
- Sneak Peek Esc-to-close modal behavior
- Custom 404 page for GitHub Pages
- SEO metadata (Open Graph and Twitter tags)

## Tech Stack

- HTML5
- CSS3
- JavaScript (Vanilla)

## Project Structure

```text
PortfolioWebsite/
|-- .nojekyll
|-- 404.html
|-- index.html
|-- README.md
|-- assets/
|   |-- icons/
|   |   `-- favicon.svg
|   |-- images/
|   |   |-- profile-portrait.jpg
|   |   `-- world-generator/
|   |       |-- worldgen-sneakpeek-01.png
|   |       |-- worldgen-sneakpeek-02.png
|   |       |-- worldgen-sneakpeek-03.png
|   |       |-- worldgen-sneakpeek-04.png
|   |       |-- worldgen-sneakpeek-05.png
|   |       |-- worldgen-sneakpeek-06.png
|   |       |-- worldgen-sneakpeek-07.png
|   |       |-- worldgen-sneakpeek-08.png
|   |       |-- worldgen-sneakpeek-09.png
|   |       |-- worldgen-sneakpeek-10.png
|   |       |-- worldgen-sneakpeek-11.png
|   |       |-- worldgen-sneakpeek-12.png
|   |       |-- worldgen-sneakpeek-13.png
|   |       `-- worldgen-sneakpeek-14.png
|   |-- videos/
|   |   `-- world-generator/
|   |       `-- Noise_Terrain.mp4
|   `-- resume/
|       `-- Punith_P_Resume.pdf
|-- css/
|   `-- main.css
`-- js/
    `-- main.js
```

## Run Locally

1. Open the project folder.
2. Start a local static server from the project root.

    Example (Python):

    ```bash
    python -m http.server 8000
    ```

3. Open: http://127.0.0.1:8000/

## Maintenance Notes

- Keep the resume file at assets/resume/Punith_P_Resume.pdf to preserve the Download Resume link.
- Keep world generator preview images in assets/images/world-generator/.
- Keep world generator preview videos in assets/videos/world-generator/.
- If you add more Sneak Peek images, continue the naming pattern: worldgen-sneakpeek-15.png, worldgen-sneakpeek-16.png, etc.
- All asset paths are relative for GitHub Pages compatibility.