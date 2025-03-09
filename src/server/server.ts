import { serve } from "@hono/node-server";

import { createApp } from "./create-app.js";

const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT) || 5173;

console.log(
  `Starting server in ${isProduction ? "production" : "development"} mode`,
);

const app = createApp({
  isProduction,
});

app.onError((error, context) => {
  // In development, let Vite handle the error display
  if (process.env.NODE_ENV === "development") {
    throw error;
  }

  console.error(error);
  return context.html(
    "<h1>Server Error</h1><p>An unknown error occured.</p>",
    500,
  );
});

app.notFound((context) => {
  return context.html(
    "<h1>Not Found</h1><p>The requested resource was not found.</p>",
    404,
  );
});

// Start the node server if this file is the entry point
if (import.meta.url === new URL(process.argv[1], "file://").href) {
  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`Listening at http://localhost:${info.port}`);
    },
  );
}

export default app;
