---
name: filetree
description: "Generate or refresh a Markdown tree of the current repository. Use when asked for a file tree, repository structure, or /filetree."
argument-hint: "Optional folder to show; defaults to the repository root"
user-invocable: true
---

# Generate a repository file tree

Create or refresh `filetree.md` in the repository root with a Markdown code block containing the current directory and file tree.

## Procedure

1. Use the repository root unless the user names a folder. If a folder is named, show paths relative to that folder but still save `filetree.md` at the repository root.
2. Read the current filesystem recursively; do not rely on an existing tree document, Git-tracked files alone, or a stale snapshot.
3. Include hidden project configuration and source files. Exclude `.git`, `node_modules`, `dist`, and `coverage` directories, plus files whose names start with `.env`, so generated/vendor content and environment files are not listed.
4. Sort directories before files, then alphabetically within each group. Render directories with a trailing `/` and use `|--`, `\--`, and matching indentation connectors.
5. Write the refreshed tree to `filetree.md`, replacing its previous contents. Do not edit unrelated files.
6. Confirm the file was written and that its root and representative nested entries match the filesystem.
