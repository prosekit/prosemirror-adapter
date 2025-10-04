# Preact Example

This example demonstrates how to use `@prosemirror-adapter/preact` with ProseMirror.

## Features

- **Node Views**: Custom Preact components for rendering ProseMirror nodes (headings and paragraphs)
- **Plugin Views**: Preact component displaying document size
- **Widget Decorations**: Preact component for rendering hash symbols next to headings
- **Full ProseMirror Integration**: Uses the standard ProseMirror example setup with custom views

## Running the Example

```bash
pnpm install
pnpm start
```

Then open http://localhost:5173 in your browser.

## Key Components

- `Editor.tsx`: Main editor component that sets up the ProseMirror editor with custom views
- `Heading.tsx`: Custom node view for heading nodes
- `Paragraph.tsx`: Custom node view for paragraph nodes with selection highlighting
- `Size.tsx`: Plugin view that displays the document size
- `Hashes.tsx`: Widget decoration that shows hash symbols next to headings

## How It Works

1. The `ProsemirrorAdapterProvider` provides the necessary context for all ProseMirror adapter hooks
2. `useNodeViewFactory`, `usePluginViewFactory`, and `useWidgetViewFactory` create the view constructors
3. These constructors are passed to ProseMirror when creating the editor
4. The adapter handles rendering Preact components inside ProseMirror views using Preact portals
