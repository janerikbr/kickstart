import { FastifyServerOptions } from "fastify";

export function createLoggerConfig(
  isDevelopment: boolean,
): FastifyServerOptions["logger"] {
  if (isDevelopment) {
    return {
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
    };
  }

  // Production logger configuration
  return { level: "error" };
}
