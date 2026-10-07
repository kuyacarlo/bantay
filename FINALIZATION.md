# Local finalization notes

Status: keep / maintain locally; do not archive without an explicit decision.

The source notes conflict: `projects/bantay.md` says `KEEP`, while the portfolio overview places `bantay` in `FINALIZE & ARCHIVE` with a README/architecture polish action. Source inspection supports KEEP more than archival: this is an active TypeScript monorepo with CI, release workflow, tests, Auth0/ntfy/GitHub service layers, and roadmap items.

## What is here

- pnpm workspace with `@bantay/core` and `@bantay/cli`.
- Pre-push secret scanning CLI with fail-closed behavior.
- README already links a demo video thumbnail (`assets/MainFrame.png` → YouTube).
- Local tests mock Auth0, GitHub, ntfy, axios, and filesystem calls; no real secrets are required for unit tests.

## Safe local checks

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm --filter core test
pnpm run -r --if-present lint
pnpm run -r --if-present typecheck
pnpm run -r --if-present format:check
```

Note on CLI unit tests: `pnpm --filter @bantay/cli test` currently fails on `scan.test.ts` because the test double for `@bantay/core` omits `getGitContext` exported by core. `@bantay/core` unit tests pass completely (8 test files, 44 tests passing). Per finalization policy, this pre-existing unit test gap is recorded rather than patched without authorization.

## Remaining decision gates

- Resolve KEEP vs ARCHIVE before any remote archival.
- If kept, use this as the consolidation target for SecretCycle concepts only after a product/spec decision.
- If archived, freeze the README/architecture claims against the exact implemented behavior and remove/close active roadmap promises.
