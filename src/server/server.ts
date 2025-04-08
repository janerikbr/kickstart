import { createApp } from "./create-app.js";

const isDevelopment = process.env.NODE_ENV === "development";
const port = Number(process.env.PORT) || 3001;

console.log(
  `Starting server in ${isDevelopment ? "development" : "production"} mode`,
);

const app = await createApp({
  disableRequestLogging: true,
  // ignoreTrailingSlash: true,
  logger: isDevelopment
    ? {
        transport: {
          target: "pino-pretty",
          options: {
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
            colorize: true,
            messageFormat: "{msg}",
            singleLine: false,
          },
        },
        serializers: {
          err: (err) => {
            return {
              type: err.constructor.name,
              stack: err.stack ?? "",
              ...err,
            };
          },
        },
      }
    : { level: "error" },
});

// Error handling
app.setErrorHandler((error, _request, reply) => {
  // In development, let Vite handle the error display
  if (process.env.NODE_ENV === "development") {
    throw error;
  }

  console.error(error);

  reply
    .code(500)
    .type("text/html")
    .send("<h1>Server Error</h1><p>An unknown error occured.</p>");
});

// Not found handler
app.setNotFoundHandler((_request, reply) => {
  reply
    .code(404)
    .type("text/html")
    .send("<h1>Not Found</h1><p>The requested resource was not found.</p>");
});

app.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening at ${address}`);
});
