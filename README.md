# Table of Contents

- [Welcome](#welcome)
  - [Project Summary & Goals](#project-summary--goals)
  - [Tech Stack](#tech-stack)
    - [Why WindiCSS?](#why-windicss)
- [Getting Started](#getting-started)
  - [Pre-Reqs](#pre-reqs)
  - [Installation](#installation)
  - [Scripts](#scripts)
# Welcome!

Welcome to Elementum’s theme repository! We’re glad you’re here. 😊 Before you get started, please review the rest of this readme so you’re acquainted with our process.

## Project Summary & Goals

This is the first Shopify Online Store 2.0 theme that our team is producing, intended to be highly modular and fit the needs for low-inventory, niche-style merchants with a strong base in community building.

## Tech Stack

- Languages/Processors
    - Structure
        - HTML
        - [Liquid](https://shopify.dev/api/liquid)
    - Scripting
        - Javascript
        - [VueJS](https://vuejs.org/)
    - Styling
        - CSS
        - [PostCSS](https://postcss.org/)
        - [WindiCSS](https://windicss.org/) (on-demand version of [TailwindCSS](https://tailwindcss.com/))
- Tools
    - [ViteJS](https://vitejs.dev/)
    - [ESLint](https://eslint.org/) / [StyleLint](https://stylelint.io/) / [Theme Check](https://shopify.dev/themes/tools/theme-check) (Shopify-built liquid linter)
    - Dependabot

### Why WindiCSS?

While constructing our build process, it was found that building Tailwind via Vite took approximately 12 seconds to complete. Obviously this is *not* an ideal build time when you consider that this action would be happening every time a production build is attempted. 😅 So to cut down on time during our Github PR actions *and* initial local development, the decision was made to switch to Windi [per this suggestion from Evan You](https://twitter.com/youyuxi/status/1361353445379366912?s=20&t=_lSvaDi5Syge3c1ZtqPsWw), creator of Vue & Vite.

# Getting Started

## Pre-Reqs

- [Node (npm)](https://nodejs.org/en/)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)

## Installation

1. Clone repo via your preferred method, urls can be found above in the top right.
2. Open your terminal and cd into the project directory.
3. Run `npm i`

## Scripts

### `npm run build`

This is the standard action for building assets on the fly. It will bundle everything as configured in the main `scripts/theme.js` and serve them as production-ready assets in the `assets` directory.

### `npm run dev`

For when you need to do your local development - bundles all assets in the same fashion as a standard build, but also watches the appropriate directories for live updates!

### `npm run lint`

Runs all linters across the appropriate directories.

* **`lint:styles`**

  Runs StyleLint in the `styles` directory.

* **`lint:scripts`**
  
  Runs ESLint in the root directory.

* **`lint:liquid`**
  
  Runs theme check in the root directory.

### `npm run tests`

Runs all tests from Cypress in a pre-configured environment based on the Theme Store Requirements.

* **`tests:open`**

  Opens Cypress to run tests manually.