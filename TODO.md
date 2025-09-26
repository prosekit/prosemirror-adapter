# TODO: Add Preact Support

This file tracks the progress of adding Preact support to the repository.

**Created at:** Fri Sep 26 08:18:00 UTC 2025

## Plan

- [x] **Step 1: Branch & PR Setup** (Finished at: Fri Sep 26 08:18:32 UTC 2025)
  - [x] Create and switch to a new git branch `feat/add-preact-support`.
  - [x] Create this `TODO.md` file.
  - [x] Commit and push `TODO.md`.
  - [x] Create a draft Pull Request on GitHub.

- [x] **Step 2: Scaffold `packages/preact`** (Finished at: Fri Sep 26 08:21:19 UTC 2025)
  - [x] Create the directory `packages/preact/src`.
  - [x] Create and adapt `packages/preact/package.json` from the `react` version.
  - [x] Create and adapt `packages/preact/tsconfig.json` from the `react` version.

- [x] **Step 3: Implement Core `preact` Logic** (Finished at: Fri Sep 26 08:29:24 UTC 2025)
  - [x] Copy `packages/react/src/**/*.ts*` to `packages/preact/src`.
  - [x] Rename files to use `Preact` prefix instead of `React`.
  - [x] Adapt the source code for Preact (imports, types, etc.).
  - [x] Ensure the package builds successfully with `pnpm run build`.

- [x] **Step 4: Scaffold `examples/preact`** (Finished at: Fri Sep 26 08:41:49 UTC 2025)
  - [x] Create the directory `examples/preact`.
  - [x] Copy and adapt the `react` example.
  - [x] Update dependencies and Vite configuration for Preact.
  - [x] Ensure the example runs and works correctly.

- [x] **Step 5: Add E2E Tests for `preact`** (Finished at: Fri Sep 26 08:47:52 UTC 2025)
  - [x] Create a new test file in `e2e/tests` for Preact, likely by copying and adapting `node-view.spec.ts`.
  - [x] Add a new `e2e/preact` project that uses these tests.
  - [x] Ensure the E2E tests pass with `pnpm run test`.

- [ ] **Step 6: Documentation**
  - [ ] Update the root `README.md` to include Preact.
  - [ ] Add a `README.md` for `packages/preact`.

- [ ] **Step 7: Finalization**
  - [ ] Run all checks: `pnpm run build`, `pnpm run test`, `pnpm run lint`.
  - [ ] Remove `TODO.md`.
  - [ ] Mark the Pull Request as ready for review.
