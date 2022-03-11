import { SessionContainer } from "supertokens-node/recipe/session";

declare global {
  namespace Express {
    export interface Request {
      session: SessionContainer;
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest<
    HttpRequest,
    Query = fastify.DefaultQuery,
    Params = fastify.DefaultParams,
    Headers = fastify.DefaultHeaders,
    Body = any
  > {
    user: string
  }
}