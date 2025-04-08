import { App } from "../app";
import { HomePage } from "../pages/home/Home";

import fs from "node:fs";
import path from "node:path";
import { fastify, FastifyInstance, FastifyServerOptions } from "fastify";
import fastifyStatic from "@fastify/static";

const isDevelopment = process.env.NODE_ENV === "development";

interface ManifestEntry {
  file: string;
  src: string;
  isEntry?: boolean;
  css?: string[];
}

export async function createApp(
  options: FastifyServerOptions = {},
): Promise<FastifyInstance> {
  const app = fastify(options);

  // Load manifest in production
  const manifest = isDevelopment ? {} : loadManifest();

  if (isDevelopment) {
    // Fastify does not support middleware out of the box, so we
    // register middie in order to use the `.use` Express-like syntax.
    const { fastifyMiddie } = await import("@fastify/middie");
    const { createServer } = await import("vite");

    // Register middie without specifying a hook (this is important)
    await app.register(fastifyMiddie);

    // Create the Vite server with explicit configuration
    const vite = await createServer({
      configFile: path.resolve("vite.development.config.ts"),
      server: {
        middlewareMode: true,
      },
      clearScreen: false, // Easier debugging
    });

    // Add Vite's middleware - this MUST be registered as a global middleware
    app.use(vite.middlewares);

    app.decorate("vite", vite);
  }

  // Serve static assets in production
  if (!isDevelopment) {
    await app.register(fastifyStatic, {
      root: path.resolve("dist/client"),
      prefix: "/assets/",
    });
  }

  // Home route
  app.get("/", async (request, reply) => {
    try {
      // Get HTML template
      let template = loadTemplate(isDevelopment);
      const url = request.url;

      // In development, apply Vite HTML transforms
      if (isDevelopment && fastify.vite) {
        // Process the template with Vite to inject HMR client
        template = await fastify.vite.transformIndexHtml(url, template);
      }

      const renderModule = await loadRenderModule(isDevelopment);

      // Render the component
      const applicationMarkup = renderModule.render(
        <App>
          <HomePage />
        </App>,
      );

      // Get script and CSS links
      const { scriptTag, cssLinks } = getScriptAndCssLinks(
        isDevelopment,
        manifest,
      );

      // Assemble the full document
      const markup = renderHTMLTemplate(template, {
        applicationMarkup: applicationMarkup,
        title: "Home Page",
        metaTags:
          '<meta name="description" content="Welcome to our home page">',
        scriptTag,
        cssLinks,
      });

      return reply.type("text/html").send(markup);
    } catch (error) {
      console.error("Server render error:", error);
      if (isDevelopment && fastify.vite) {
        // For development, pass the error to Vite's error overlay
        fastify.vite.ssrFixStacktrace(error as Error);
      }
      reply.status(500).send({ error: "Internal Server Error" });
    }
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

function loadTemplate(isDevelopment: boolean): string {
  const templatePath = isDevelopment
    ? path.resolve("index.html")
    : path.resolve("dist/client/index.html");

  return fs.readFileSync(templatePath, "utf-8");
}

async function loadRenderModule(isDevelopment: boolean) {
  if (isDevelopment) {
    return import("./entry-server.js");
  } else {
    const entryPath = path.resolve("dist/server/entry-server.js");
    const moduleUrl = `file://${entryPath}`;
    return import(moduleUrl);
  }
}

function getScriptAndCssLinks(
  isDevelopment: boolean,
  manifest: Record<string, ManifestEntry>,
): { scriptTag: string; cssLinks: string } {
  let scriptTag = "";
  let cssLinks = "";

  if (isDevelopment) {
    // In development mode, we let Vite inject its client script
    // through transformIndexHtml, so we just need our entry point
    scriptTag =
      '<script type="module" src="/src/pages/home/client.tsx"></script>';
    // Don't manually include CSS in dev mode, Vite handles it
    cssLinks = "";
  } else {
    // Production mode stays the same...
    const homeEntry = Object.values(manifest).find(
      (entry) =>
        (entry.src?.includes("home/client") ||
          entry.src?.includes("pages/home")) &&
        entry.isEntry,
    );

    if (homeEntry) {
      scriptTag = `<script type="module" src="/assets/${homeEntry.file}"></script>`;

      if (homeEntry.css && homeEntry.css.length > 0) {
        cssLinks = homeEntry.css
          .map((css) => `<link rel="stylesheet" href="/assets/${css}">`)
          .join("");
      }
    } else {
      console.warn("Could not find home entry in manifest!");
      scriptTag = "<!-- Home entry script not found in manifest -->";
    }
  }

  return { scriptTag, cssLinks };
}
