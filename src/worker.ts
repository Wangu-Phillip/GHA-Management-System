import app, { type Bindings, type Variables } from './server';
import { Context } from 'hono';

// Serve the SPA for any non-API route by falling through to the ASSETS binding.
app.notFound(async (c: Context<{ Bindings: Bindings; Variables: Variables }>) => {
  if (c.env?.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text('Assets binding not configured', 500);
});

// Export the Hono app directly as the Worker default export.
// Hono implements ExportedHandler, so Cloudflare calls app.fetch(request, env, ctx)
// with the correct `this` binding — no manual wrapping needed.
export default app;