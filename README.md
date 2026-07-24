# prosemirror-adapter

<p align="center">
    <br/>
    <br/>
    <img src="/assets/logo.svg?raw=true" width="400"/>
    <br/>
    <br/>
</p>

Universal adapter for [ProseMirror](https://prosemirror.net/) to use it with modern UI frameworks.

![npm](https://img.shields.io/npm/v/@prosemirror-adapter/core)
[![ci](https://github.com/prosekit/prosemirror-adapter/actions/workflows/ci.yml/badge.svg)](https://github.com/prosekit/prosemirror-adapter/actions/workflows/ci.yml)

## What is this?

[Prosemirror](https://github.com/ProseMirror/prosemirror) is a toolkit to build modern rich text editors.
But it is not a good fit for a modern UI framework like React or Vue.
This adapter is a low level tool to make it work with them without pain.
You'll need this adapter if you want to use Prosemirror to build a rich text editor with complex UI in modern UI frameworks we support.

### What's on the plan?

- [x] Support Popular UI Frameworks
  - [x] [React](https://reactjs.org/)
  - [x] [Preact](https://preactjs.com/)
  - [x] [Vue](https://vuejs.org/)
  - [x] [Svelte](https://svelte.dev/)
  - [x] [Lit](https://lit.dev/)
  - [x] [Solid](https://solidjs.com/)
  - [ ] 🚀 coming soon...
- [x] Add out of box support for prosemirror features
  - [x] [Prosemirror Node View](https://prosemirror.net/docs/ref/#view.NodeView)
  - [x] [Prosemirror Mark View](https://prosemirror.net/docs/ref/#view.MarkView)
  - [x] [Prosemirror Plugin View](https://prosemirror.net/docs/ref/#state.PluginView)
  - [x] [Prosemirror Widget Decoration](https://prosemirror.net/docs/ref/#view.Decoration%5Ewidget)

### What's not on the plan?

This package should only take care about building a bridge between prosemirror and UI frameworks. It should be kept as an low level binding.
So something out of this scope will not be considered. For example:

- ❎ We won't provide UI components.
- ❎ We won't provide key bindings.
- ❎ We won't provide schema for special modules like table or math.

## Getting Started

<table>
  <tr>
    <th>react</th>
    <th>preact</th>
    <th>vue</th>
    <th>svelte</th>
    <th>lit</th>
    <th>solid</th>
  </tr>
  <tr>
    <td>
      <a align="center" title="react" href="/packages/react">
        <img src="/assets/react.svg" width="100" height="100" alt="react">
      </a>
    </td>
    <td>
      <a align="center" title="preact" href="/packages/preact">
        <img src="/assets/preact.svg" width="100" height="100" alt="preact">
      </a>
    </td>
    <td>
      <a align="center" title="vue" href="/packages/vue">
        <img src="/assets/vue.svg" width="100" height="100" alt="vue">
      </a>
    </td>
    <td>
      <a align="center" title="svelte" href="/packages/svelte">
        <img src="/assets/svelte.svg" width="100" height="100" alt="svelte">
      </a>
    </td>
    <td>
      <a align="center" title="lit" href="/packages/lit">
        <img src="/assets/lit.svg" width="100" height="100" alt="lit">
      </a>
    </td>
    <td>
      <a align="center" title="solid" href="/packages/solid">
        <img src="/assets/solid.svg" width="100" height="100" alt="solid">
      </a>
    </td>
  </tr>
</table>

## Manually reproduce typing over a selected code block

The E2E example contains a decorated code block rendered as a node view. Its
inline syntax highlighter gives keywords, identifiers, operators, and strings
different colors, so the editable code is split across multiple `<span>`
elements.

To reproduce the first-character regression:

1. Install dependencies and build the packages:

   ```sh
   pnpm install
   pnpm build
   ```

2. Start the E2E example:

   ```sh
   pnpm ex
   ```

3. Open one of the framework pages printed by Astro, for example
   `http://localhost:4321/lit/`.
4. Find the code block containing `const greeting = "hello"`.
5. Select the complete code text, from the first character of `const` through
   the final quote of `"hello"`.
6. Type `1`.

The expected result is one code block containing `1`. In Chromium and Safari,
the current failure removes the first typed character. Typing more text
afterward works, which can hide the original failure.

The automated reproduction runs the same interaction for Lit, Preact, React,
Solid, Svelte, and Vue in Chromium, Firefox, and WebKit:

```sh
pnpm --filter=e2e test \
  -g 'code block node view preserves the first character typed over a full selection' \
  --retries 0
```

## Contributing

PR welcome! Follow our [contribution guide](/CONTRIBUTING.md) to learn how to contribute to prosemirror-adapter.

## License

[MIT](/LICENSE)
