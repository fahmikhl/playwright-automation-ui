# Test Plan — DemoQA Book Store

**Application under test:** `https://demoqa.com/books`
**Tooling:** Playwright + TypeScript, Page Object Model, API-driven setup.

---

## 1. Objective & Scope

Automate the core user journeys of the Book Store and verify correct behaviour
across **happy paths, negative paths, and edge cases** — including the responses
and errors the application is expected to return.

**In scope:** search, pagination, book detail, login, user profile & collection.
**Out of scope:** third-party ads, payment, account deletion, cross-browser
matrix (Chromium only by design — extensible to WebKit/Firefox via config).

---

## 2. Test Strategy

| Decision | Rationale |
| --- | --- |
| **Page Object Model** | Selectors/actions live in one place per page → resilient, DRY specs. |
| **API-driven auth** (`auth.setup.ts`) | Register + tokenise via the Account API, persist storage state to `.auth/user.json`. Fast, deterministic, and keeps UI-login behaviour as its *own* test rather than a precondition. |
| **Project separation** | `chromium` runs anonymous flows; `chromium-auth` loads the saved session for profile specs. Both depend on `setup`. |
| **Isolated login account** | DemoQA allows one token per account; UI login regenerates it, so `login.spec.ts` uses a throwaway account to avoid invalidating the profile session. |
| **Data-driven** | Known books / search terms centralised in `src/data` so cases scale by adding data, not code. |

---

## 3. Test Environment

- **Base URL** configurable via `BASE_URL` (default `https://demoqa.com`).
- **Timeouts:** 60 s test / 30 s navigation / 15 s action / 10 s assertion — the
  site is public and ad-heavy, so timeouts are generous.
- **Reliability:** `retries: 1` locally / `2` on CI; **trace on first retry,
  screenshot on failure, video on failure** for fast triage.
- Secrets (`.env`) and auth artifacts (`.auth/`) are gitignored.

---

## 4. Test Scenarios — Cases, Expected Responses & Errors

### 4.1 Search
| Case | Type | Expected result |
| --- | --- | --- |
| Exact title | Happy | Matching book listed |
| Keyword | Happy | All books containing the keyword listed |
| Case-insensitive query | Edge | Same matches regardless of case |
| ISBN query | Edge | **No match** (rebuilt site no longer indexes ISBN) |
| Unknown term | Negative | "No rows found" / empty table, no crash |
| Special characters | Negative | Handled gracefully, no results, no error |
| Excessively long query | Negative | Handled gracefully, no results |
| Clear search | Edge | Full catalogue restored |

### 4.2 Pagination
| Case | Type | Expected result |
| --- | --- | --- |
| Full catalogue renders on one page | Happy | All rows visible (rebuilt site fits on one page) |
| Previous / Next on a single page | Edge | Controls disabled |

### 4.3 Book Detail
| Case | Type | Expected result |
| --- | --- | --- |
| Open a book from the list | Happy | Title/author/publisher match the list row |
| ISBN from URL (`?search=<isbn>`) | Edge | Detail loaded by ISBN in the query string |
| Back navigation | Happy | Returns to the catalogue |

### 4.4 Login
| Case | Type | Expected result |
| --- | --- | --- |
| Valid credentials | Happy | Redirect to profile |
| Invalid credentials | Negative | Inline error shown, stays on login |
| Empty fields | Negative | No navigation; validation prevents submit |

### 4.5 Profile & Collection
| Case | Type | Expected result |
| --- | --- | --- |
| Logged-in user shown | Happy | Username rendered |
| Empty collection | Edge | Empty state rendered |
| Book added (via API) appears | Happy | Row rendered in collection |
| Emptied collection | Edge | Returns to empty state |
| Logout | Happy | Session cleared, back to login |

---

## 5. Error & Resilience Handling

- **Network / timeouts:** generous, layered timeouts + one retry absorb the
  site's ad-driven flakiness without masking real failures.
- **Auth failures:** setup fails fast with a clear message if token generation
  fails, so dependent projects don't run against a broken session.
- **Backend drift:** the rebuilt site removed ISBN search and paging controls —
  specs assert the *current* contract and document the change, so a future
  reversal surfaces as a visible failure rather than silent staleness.
- **Test isolation:** profile specs run **serially** and clean up the collection
  after each test to prevent cross-test contamination.

---

## 6. Execution & Reporting

```bash
npm test            # full suite, headless
npm run test:headed # headed debugging
npx tsc --noEmit    # type check
```

- **Reporters:** `list` (console) + `html` (artifact, with trace/screenshot/video).
- **CI:** single worker, `forbidOnly`, 2 retries; HTML report + traces uploaded
  as build artifacts.

---

## 7. Entry / Exit Criteria

**Entry:** app reachable at `BASE_URL`; dependencies installed; setup project
produces a valid session.
**Exit:** all specs green (or known failures triaged with trace evidence);
type-check and formatting pass; no secrets committed.

---

## 8. Risks & Future Work

| Risk | Mitigation / next step |
| --- | --- |
| Public site instability / ads | Timeouts + retries; consider a mocked/staged backend |
| Single browser coverage | Add WebKit/Firefox projects (config-only change) |
| One-token-per-account constraint | Throwaway accounts per concern; documented in README |
| No visual/a11y checks yet | Add visual snapshots + accessibility assertions |
