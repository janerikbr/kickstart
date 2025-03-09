import fs from "node:fs";
import path from "node:path";

import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";

import { App } from "../app";
import { HomePage } from "../pages/home/Home";

interface ManifestEntry {
  file: string;
  src: string;
  isEntry?: boolean;
  css?: string[];
}

export function createApp({ isProduction }: { isProduction: boolean }) {
  const app = new Hono();

  // Load manifest in production
  const manifest = isProduction ? loadManifest() : {};

  // Serve static assets in production
  if (isProduction) {
    app.use("/assets/*", serveStatic({ root: "dist/client" }));
  }

  // Home route
  app.get("/", async (context) => {
    const template = loadTemplate(isProduction);
    const renderModule = await loadRenderModule(isProduction);

    // Render the component
    const applicationMarkup = renderModule.render(
      <App>
        <HomePage />
      </App>,
    );

    // Get script and CSS links
    const { scriptTag, cssLinks } = getScriptAndCssLinks(
      isProduction,
      manifest,
    );

    // Assemble the full document
    const finalHtml = renderHTMLTemplate(template, {
      applicationMarkup: applicationMarkup,
      title: "Home Page",
      metaTags: '<meta name="description" content="Welcome to our home page">',
      canonicalUrl: "https://example.com/",
      scriptTag,
      cssLinks,
    });

    return context.html(finalHtml);
  });

  return app;
}

function renderHTMLTemplate(
  template: string,
  options: {
    canonicalUrl?: string;
    title?: string;
    metaTags?: string;
    scriptTag: string;
    cssLinks: string;
    applicationMarkup: string;
  },
): string {
  let finalHtml = template;

  // Replace HTML content
  finalHtml = finalHtml.replace(
    "<!--app-html-->",
    options.applicationMarkup || "",
  );

  // Build head content
  let head = "";
  if (options.title) {
    head += `<title>${options.title}</title>`;
  }
  if (options.metaTags) {
    head += options.metaTags;
  }
  if (options.canonicalUrl) {
    head += `<link rel="canonical" href="${options.canonicalUrl}" />`;
  }

  // Replace head content
  finalHtml = finalHtml.replace("<!--app-head-->", head);

  // Replace script tag
  finalHtml = finalHtml.replace("<!--app-script-->", options.scriptTag);

  // Add CSS links
  finalHtml = finalHtml.replace("</head>", options.cssLinks + "</head>");

  return finalHtml;
}

function loadManifest(): Record<string, ManifestEntry> {
  try {
    const manifestPath = path.resolve("dist/client/.vite/manifest.json");
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  } catch (err) {
    console.error("Failed to load manifest file:", err);
    return {};
  }
}

function loadTemplate(isProduction: boolean): string {
  const templatePath = isProduction
    ? path.resolve("dist/client/index.html")
    : path.resolve("index.html");

  return fs.readFileSync(templatePath, "utf-8");
}

async function loadRenderModule(isProduction: boolean) {
  if (isProduction) {
    const entryPath = path.resolve("dist/server/entry-server.js");
    const moduleUrl = `file://${entryPath}`;
    return import(/* @vite-ignore */ moduleUrl);
  } else {
    return import("./entry-server.js");
  }
}

function getScriptAndCssLinks(
  isProduction: boolean,
  manifest: Record<string, ManifestEntry>,
): { scriptTag: string; cssLinks: string } {
  let scriptTag = "";
  let cssLinks = "";

  if (isProduction) {
    const homeEntry = Object.values(manifest).find(
      (entry) =>
        (entry.src?.includes("home/client") ||
          entry.src?.includes("pages/home")) &&
        entry.isEntry,
    );

    if (homeEntry) {
      scriptTag = `<script type="module" src="/${homeEntry.file}"></script>`;

      if (homeEntry.css && homeEntry.css.length > 0) {
        cssLinks = homeEntry.css
          .map((css) => `<link rel="stylesheet" href="/${css}">`)
          .join("");
      }
    } else {
      console.warn("Could not find home entry in manifest!");
      scriptTag = "<!-- Home entry script not found in manifest -->";
    }
  } else {
    scriptTag =
      '<script type="module" src="/src/pages/home/client.tsx"></script>';
    cssLinks = '<link rel="stylesheet" href="/src/app.css">';
  }

  return { scriptTag, cssLinks };
}
