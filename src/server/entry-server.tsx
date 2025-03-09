import { VNode } from "preact";
import renderToString from "preact-render-to-string";

/**
 * Server-Side Rendering Entry Point
 *
 * This file provides the core rendering function used to convert Preact components
 * to HTML strings on the server. It is dynamically imported by the server when
 * rendering pages.
 *
 * How it's used:
 * 1. The server imports this module in production via loadRenderModule()
 * 2. When a route is requested, server calls render() with the appropriate component
 * 3. The resulting HTML string is inserted into the page template
 *
 * This file is a critical part of the SSR architecture and should not be deleted.
 * It's built separately from the server code but is required at runtime.
 */
export function render(element: VNode<unknown>) {
  const html = renderToString(element);

  if (!html) {
    throw new Error("renderToString returned empty result");
  }

  return html;
}
