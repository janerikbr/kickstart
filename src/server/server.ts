import { createApp } from "./create-app.js";
import { createErrorHandler } from "./error-handler.ts";
import { createLoggerConfig } from "./logger.ts";
import { createNotFoundHandler } from "./not-found-handler.ts";

const isDevelopment = process.env.NODE_ENV === "development";
const port = Number(process.env.PORT) || 3000;

const app = await createApp({
  disableRequestLogging: true,
  ignoreTrailingSlash: true,
  logger: createLoggerConfig(isDevelopment),
});

if (!isDevelopment) {
  app.setErrorHandler(createErrorHandler());
}

app.setNotFoundHandler(createNotFoundHandler());
app.listen({ port, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening at ${address}`);
});
