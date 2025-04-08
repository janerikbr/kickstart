# About Kickstart
Kickstart is a boilerplate project designed for quickly starting new, SSR-powered web applications using Fastify, Preact,
Vite and TailwindCSS. 

## Prerequisites
[Node.js](https://nodejs.org/en) and [pnpm](https://pnpm.io/).

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:janerikbr/kickstart.git kickstart
    cd kickstart
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Kickstart your new project:**

    ```bash
    pnpm kickstart
    ```
    This will prompt you for a project name and then create the project.

4.  **Start the development server:**

    ```bash
    pnpm dev
    ```

## Building for Production
Work in progress.

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

