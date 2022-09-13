import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://k6.tf",
  markdown: {
    remarkPlugins: [
      () => (tree, file) => {
        file.data.astro.frontmatter.layout = "@layouts/Post.astro";
      }
    ],
  },
});
