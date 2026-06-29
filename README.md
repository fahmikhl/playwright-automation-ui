# Playwright Automation UI — DemoQA Book Store

End-to-end UI automation for the DemoQA Book Store application
(`https://demoqa.com/books`), built with Playwright and TypeScript using the
Page Object Model.

## Coverage

| Area        | Happy flow                          | Negative flow                          | Edge cases                                            |
| ----------- | ----------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| Search      | Title and keyword matches           | Unknown term, special chars, long query → no results | Case insensitivity, ISBN not matched, clearing restores the list |
| Pagination  | Full catalogue renders on one page  | —                                      | Previous/Next disabled on a single page               |
| Book detail | Details match the list, back nav    | —                                      | ISBN read from the URL (`?search=<isbn>`)             |
| Login       | Valid credentials reach the profile | Wrong credentials show error           | Empty fields do not navigate                          |
| Profile     | Collection rendering, logout        | —                                      | Empty and emptied collection states                   |

> The DemoQA Book Store was rebuilt: search no longer matches by ISBN, and the
> rows-per-page / jump-to-page controls were removed (the catalogue always fits
> on one page). The specs reflect the current behaviour.

## Project structure

```
src/
  pages/        Page objects (BasePage, BookStorePage, BookDetailPage, LoginPage, ProfilePage)
  fixtures/     Custom test fixtures wiring the page objects and auth session
  data/         Known books and search test data
  utils/        Account and Book Store API helpers used for setup
tests/
  auth.setup.ts Builds an authenticated session over the API (no UI login)
  *.spec.ts     Test specs grouped by feature
```

Path aliases (`@pages/*`, `@fixtures/*`, `@data/*`, `@utils/*`) are defined in
`tsconfig.json`.

## Authentication

`auth.setup.ts` authenticates **entirely through the Account API** — it
registers a fresh account (or reuses the one named via env), generates a token,
and writes a cookie-based storage state to `.auth/user.json`. No browser or UI
login is involved; login-form behaviour is covered separately by
`tests/login.spec.ts`.

DemoQA allows only **one valid token per account** — generating a new token
invalidates the previous one. Because a UI login regenerates the token,
`login.spec.ts` uses its own throwaway account so it cannot invalidate the
session the profile specs depend on.

## Setup

```bash
npm install
npx playwright install chromium
```

Optionally copy `.env.example` to `.env` to change `BASE_URL`, route traffic
through a proxy, or reuse a specific account. When no account is provided the
suite registers a fresh one automatically during setup.

```dotenv
BASE_URL=https://demoqa.com
DEMOQA_USERNAME=
DEMOQA_PASSWORD=
DEMOQA_USERID=
```

- To reuse an account that **already exists**, set all three values. `DEMOQA_USERID`
  is required because the API cannot look the id up from the username alone.
- Quote the password if it contains a `#`, otherwise dotenv treats the rest of
  the line as a comment, e.g. `DEMOQA_PASSWORD="Pa#ss"`.

## Running

```bash
npm test                              # full suite (headless)
npm run test:headed                   # headed
```

The `setup` project authenticates once and saves the session to `.auth/`. Two
browser projects depend on it:

- **`chromium`** — anonymous flows (book store, search, pagination, login).
- **`chromium-auth`** — the profile specs, which load the saved storage state
  at the project level.

## Quality checks

```bash
npx tsc --noEmit          # type check
npx prettier --check .    # formatting
```

## Notes

- The site is public and ad-heavy; generous timeouts and a retry are configured
  in `playwright.config.ts`.
- The profile specs run serially because they share one Book Store account and
  clean up the collection after each test.
- Auth artifacts in `.auth/` and your `.env` are gitignored.
