import { FastifyReply, FastifyRequest } from "fastify";

export function createErrorHandler() {
  return (error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    console.error(error);
    reply.code(500).type("text/html").send("<h1>Error</h1>");
  };
}
