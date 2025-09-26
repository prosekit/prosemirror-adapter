# Preact Example

This is an example of using `@prosemirror-adapter/preact` to integrate ProseMirror with Preact.

## Features

- **Node Views**: Custom components for paragraph and heading nodes
- **Plugin Views**: A plugin that displays the document size
- **Widget Views**: Hash symbols that appear before headings
- **Mark Views**: Support for custom mark rendering

## Running

```bash
pnpm start
```

## Components

- `Editor.tsx` - Main editor component that sets up ProseMirror
- `Paragraph.tsx` - Custom node view for paragraphs (highlights when selected)
- `Heading.tsx` - Custom node view for headings (renders as appropriate heading level)
- `Size.tsx` - Plugin view that shows document size
- `Hashes.tsx` - Widget view that shows hash symbols before headings

## Key Features Demonstrated

1. **ProsemirrorAdapterProvider** - Context provider for all view types
2. **useNodeViewFactory** - Hook to create custom node views
3. **usePluginViewFactory** - Hook to create plugin views
4. **useWidgetViewFactory** - Hook to create widget decorations
5. **Context hooks** - Access to ProseMirror data within components
