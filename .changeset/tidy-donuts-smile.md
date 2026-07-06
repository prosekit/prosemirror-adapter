---
'@prosemirror-adapter/core': patch
---

Stop ignoring DOM mutations that remove the `contentDOM` element, so ProseMirror stays in sync when the browser's native editing replaces a fully selected node view or mark view content.
