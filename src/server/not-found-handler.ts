import { FastifyReply, FastifyRequest } from "fastify";

export function createNotFoundHandler() {
  return (_request: FastifyRequest, reply: FastifyReply) => {
    reply
      .code(404)
      .type("text/html")
      .send("<h1>Not Found</h1><p>The requested resource was not found.</p>");
  };
}
