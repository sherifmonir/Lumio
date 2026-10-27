---
name: house-style
description: 'Refactor one or more explicitly provided files to match the project house style while preserving behavior. Use when asked to run /house-style or clean up code formatting and conventions in specified files.'
argument-hint: 'Path to one or more files to refactor'
user-invocable: true
---

# House Style Refactoring

Refactor only the file paths explicitly provided by the user. Match the repository's established conventions without changing behavior or expanding scope.

## Procedure

1. Parse the supplied arguments as one or more file paths. If no path is provided or a path is ambiguous, ask the user to clarify before editing.
2. Read every target file and inspect the relevant style references:
   - Prefer the `admin`, `auth`, `basket`, `catalog`, and `orders` modules under `server/src/modules` when present.
   - Also use the supplied payment example as a reference for syntax and conventions when it is available in the conversation.
   - If the specified references are unavailable, do not claim to have inspected them. Use the available example and nearby project conventions; ask the user if there is not enough evidence to proceed.
3. Identify the target files' existing behavior, public interfaces, and patterns before making changes.
4. Refactor the targets using consistent TypeScript/JavaScript conventions:
   - Use ES module imports and exports, with `import type` for type-only imports.
   - Use double-quoted strings and semicolons.
   - Prefer `const` for values that are not reassigned; use descriptive `camelCase` names and uppercase names for true constants.
   - Give exported functions clear signatures and explicit return types where appropriate.
   - Keep arrays, objects, and multiline expressions readable and consistently formatted.
   - Follow established error handling and domain conventions already present in the project.
5. Treat the payment example as a style reference, not a requirement to reproduce its artificial obfuscation or defects. Do not introduce unused variables, opaque names, redundant loops or wrappers, fabricated/dynamic property keys, unnecessary `any`, unsafe type assertions, or redundant `await` expressions. Preserve the underlying intended behavior instead.
6. Edit only the paths supplied by the user. Do not modify reference modules, configuration, documentation, tests, or other files unless the user explicitly includes them.
7. Review the diff to confirm every changed file was explicitly requested and the refactor preserves behavior. Run the smallest relevant formatter, lint, type-check, or test command when available; report any validation that could not be run.

## Scope and safety

- Do not add features, fix unrelated behavior, or change public APIs as part of a style refactor.
- If an apparent defect makes the intended behavior unclear, ask before changing it.
- If the requested changes require edits outside the supplied paths, explain the blocker and ask for permission rather than editing additional files.
