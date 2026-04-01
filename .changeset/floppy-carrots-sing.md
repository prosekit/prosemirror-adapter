---
'@prosemirror-adapter/vue': patch
---

Stop `updateContext` from leaking reactive subscriptions to outer effects.
