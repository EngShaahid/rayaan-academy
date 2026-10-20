/* Tailwind Play CDN configuration.
   - prefix "tw-" keeps Tailwind utilities from clashing with Bootstrap classes.
   - preflight is disabled so Tailwind does not reset Bootstrap's base styles.
   Production note: the Play CDN compiles in the browser and is meant for
   development. For production, build a static CSS file with the Tailwind CLI
   using the same prefix and remove the CDN script. */
window.tailwind = window.tailwind || {};
window.tailwind.config = {
  prefix: 'tw-',
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#B5031D', dark: '#7d0214', charcoal: '#363636' }
      }
    }
  }
};
