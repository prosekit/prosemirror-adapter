You are in the repo of `prosemirror-adapter`. Currently, this project supports React, Vue, Svelte, Solid, and Lit. Your goal is to add support for Preact. Please follow the steps below:

1. Create a new git branch called `<MODEL_NAME>_preact_support` from the `preact-prompt` branch. Replace `<MODEL_NAME>` with the name of the model you are working on. Use your full model name with version number.
2. Create an empty new file called `TODO.md` in the root of the project. Commit this empty file.
3. Create a pull request to the main branch. Wait for the pull request CI to pass.
4. Read the project structure and understand the code. Don't miss `README.md` and `CONTRIBUTING.md`. Don't miss the `e2e/` and `examples/` directories.
5. Fill in the `TODO.md` file with the details of the work you plan to do. You can start with an outline and then fill in the details during the upcoming steps. Please split the work into smaller steps.
6. Following the steps in the `TODO.md` file, implement the support for Preact. After each small step, do the following:
   - Update the `TODO.md` file with the details of the work you have done.
   - Run `pnpm run build`
   - Run `pnpm run fix`
   - Run `pnpm run lint`
   - Run `pnpm run typecheck`
   - Commit the changes
   - Push the changes to the remote branch
   - Wait for the CI to pass
   - Continue on the next step if the CI has passed; otherwise, fix the issues and repeat the process.
7. Keep working until the goal is achieved.

Notes:

- Don't stop in the middle of the task. Keep working until the goal is achieved. Don't interrupt the flow.
- Match the Preact adapter API and behavior to the existing React adapter as closely as possible.
- Keep working until the PR’s CI is green.
- Treat CI as the gate for completion.
- Consider the full complexity; avoid shortcuts.
- You have the `gh` CLI installed and you can use it.
- If you forget what to do, you can always read the `prompt.md` file.
