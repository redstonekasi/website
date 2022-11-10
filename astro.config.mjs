import { defineConfig } from 'astro/config';

import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";

// https://astro.build/config
export default defineConfig({
  site: "https://k6.tf",
  markdown: {
    remarkPlugins: [() => (tree, file) => {
      file.data.astro.frontmatter.layout = "@layouts/Post.astro";
    }]
  },
  integrations: [sitemap(), prefetch()],
});
