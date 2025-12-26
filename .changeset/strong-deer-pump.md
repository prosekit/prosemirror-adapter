---
'@prosemirror-adapter/preact': patch
'@prosemirror-adapter/react': patch
---

Improve lifecycle handling to avoid warnings like "flushSync was called from inside a lifecycle method" in race conditions.
