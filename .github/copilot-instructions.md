# Lumio repository instructions

## Build, lint, and tests

- Install the root app dependencies with `npm install`.
- Run the Vite development server with `npm run dev`.
- Build the frontend and run the TypeScript project checks with `npm run build`.
- Lint the frontend with `npm run lint`; lint one file with `npx eslint src/path/to/file.tsx`.
- There is no configured test script or test suite, so there is no single-test command.
- The notification function is a separate package under `functions/create-notification`; its formatter is `npm --prefix functions/create-notification run format`.

## Architecture

- This is a React 19 + TypeScript single-page app built with Vite. `src/main.tsx` composes the browser router, TanStack Query, auth, and theme providers; `src/App.tsx` declares public sign-in/sign-up routes and authenticated app routes.
- Authenticated pages live in `src/_root/Pages`; shared navigation/layout is in `src/_root/RoutLayout.tsx`, and reusable UI is in `src/components`. Route page exports are collected in `src/_root/Pages/index.ts`.
- Appwrite access is centralized in `src/lib/appwrite/config.ts` and `src/lib/appwrite/api.ts`. API functions perform auth, database, and storage operations; `src/lib/react-query/queriesAndMutatuins.tsx` exposes them as query/mutation hooks, with query identifiers in `queryKeys.ts`. When a mutation changes displayed data, keep its query invalidation or cache update in sync.
- `src/context/AuthContect.tsx` owns the current-user auth state. `src/types/index.ts` defines the Appwrite-backed app models; `src/lib/validation/index.ts` defines Zod schemas used by forms.
- `functions/create-notification/src/main.js` is the separately deployed Appwrite event function, linked from `appwrite.config.json`. It translates follow, like/comment/reply, post, and mention events into notification rows. The `likes` table is also used for comments and replies, so event interpretation depends on the payload fields, not just the table name.
- `appwrite.config.json` tracks the Appwrite project resources and function deployment settings. Keep resource changes represented there; consult `.agents/skills/appwrite-cli/SKILL.md` before using the Appwrite CLI. For SDK work, follow the existing client SDK usage in `src/lib/appwrite/api.ts` and consult `.agents/skills/appwrite-typescript/SKILL.md`.

## Repository conventions

- Use the `@/` alias for imports from `src/` (configured in Vite and `tsconfig.app.json`).
- Add Appwrite operations to `src/lib/appwrite/api.ts` and expose app-facing data access through hooks in `src/lib/react-query/queriesAndMutatuins.tsx`; keep corresponding keys in `src/lib/react-query/queryKeys.ts`.
- Forms use `react-hook-form` with `zodResolver` and schemas from `src/lib/validation/index.ts`. Keep form values and Appwrite payloads aligned with the shared types in `src/types/index.ts`.
- The existing browser client uses the `appwrite` package's `Databases`, `Storage`, and `Account` APIs with the configured environment values in `src/lib/appwrite/config.ts`. Avoid introducing a second client/configuration path for the same frontend operations.
