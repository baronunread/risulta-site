// Sproutboat requires a `main` handler even for a static site. The edge serves every file in
// dist/ itself; this only runs for paths that match no file.
export default {
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },
};
