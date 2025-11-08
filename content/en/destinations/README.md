# Destination Content Structure

Place markdown-driven destination assets inside this folder.

```
content/
  destinations/
    <destination>/
      tour-packages/
        <slug>.md
        json/
          <slug>.json   # optional JSON-LD graph
      taxi/
        <slug>.md
      sightseeing/
        <slug>.md
      travel-guide/
        <slug>.md
```

- The folder name becomes the `destination` segment in the live URL.
- The markdown filename (without `.md`) becomes the slug segment.
- Each markdown file should include front matter (`title`, `description`, etc.) followed by rich markdown content.
- Optional `json/<slug>.json` files are automatically loaded and inlined as JSON-LD schema.
