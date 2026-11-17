'use client';

/**
 * Renders a script that runs while the browser parses the server HTML, before the first paint.
 * The server emits `text/javascript`; the client renders `text/plain` so React does not warn about
 * rendering a <script> and the script never runs a second time.
 * See https://nextjs.org/docs/app/guides/preventing-flash-before-hydration
 */
export default function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={ typeof window === 'undefined' ? 'text/javascript' : 'text/plain' }
      suppressHydrationWarning
      dangerouslySetInnerHTML={ { __html: html } }
    />
  );
}
