export function qwikVoby(): any {
  const OPTIMIZE_DEPS = ['voby', 'voby/jsx-runtime', 'voby/jsx-dev-runtime'];
  const DEDUPE = ['voby'];

  return {
    name: 'vite-plugin-qwik-voby',
    config() {
      return {
        resolve: {
          dedupe: DEDUPE,
        },
        optimizeDeps: {
          include: OPTIMIZE_DEPS,
        },
      };
    },
  };
}
