# Kickstart - Hono/Preact SSR Boilerplate

This is a boilerplate project designed for quickly starting new web applications using Preact, Hono, and Server-Side Rendering (SSR).

## Features

*   **Preact:** A fast, lightweight alternative to React, perfect for performance-sensitive applications.
*   **Hono:** An ultra-fast web framework for Cloudflare Workers, Deno, Bun, Node.js, and more.  It simplifies routing and middleware.
*   **Server-Side Rendering (SSR):** Improves initial page load performance and SEO by rendering pages on the server.
*   **Vite:**  A fast and opinionated build tool that provides blazing fast HMR during development.
*   **Vanilla Extract:**  Type-safe CSS-in-JS for predictable and maintainable styling.
*   **CSS Reset:**  Includes a custom CSS reset (Josh Comeau's) to ensure consistent styling across browsers.

## Prerequisites

*   **Node.js (>=22.14.0):**
*   **pnpm (>=10.6.1):**

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url> my-new-project
    cd my-new-project
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Kickstart your new project:**

    ```bash
    pnpm kickstart
    ```
    This will prompt you for a new project name.

4.  **Start the development server:**

    ```bash
    pnpm dev
    ```

    This will start the Vite development server. The page should automatically reload as you make changes to the code.

## Development

*   **File Structure:**
    *   `src/`: Contains the source code for your application.
        *   `app.tsx`:  The main application component, wrapping all pages.
        *   `app.css`: Global CSS styles and reset.
        *   `pages/`:  Contains individual pages of your application.
            *   `home/`:  Example home page components and styles.
        *   `server/`:  Server-side rendering logic.
            *   `create-app.tsx`: Hono application setup.
            *   `entry-server.tsx`:  The entry point for server-side rendering.
            *   `server.ts`:  The main server file, using Hono.
    *   `public/`:  Static assets (images, fonts, etc.).
    *   `vite.config.ts`:  Vite configuration file for client builds.
    *   `vite.server.config.ts`: Vite configuration file for server builds.

*   **Coding Conventions:**
    *   Use TypeScript for all source code.
    *   Follow Preact best practices for component development.
    *   Use Vanilla Extract for type-safe CSS styling.

## Building for Production

1.  **Build the client and server:**

    ```bash
    pnpm build
    ```

    This will create the following directories:

    *   `dist/client/`: Contains the client-side assets (HTML, CSS, JavaScript).
    *   `dist/server/`: Contains the server-side code.

## Running in Production

1.  **Start the server:**

    ```bash
    pnpm start
    ```

    This will start the Node.js server. Make sure you have built the project first.

## Deployment

This project is designed to be deployed to environments that can run Node.js applications.
