import app, { type Bindings } from './app';

export default {
  async fetch(request: Request, env: Bindings, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      return app.fetch(request, env, ctx);
    }

    // Hand non-API requests to the static assets binding (SPA).
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }
    return new Response('Assets binding not configured', { status: 500 });
  },
};
