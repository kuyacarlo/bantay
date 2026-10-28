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

Update: the `scan.test.ts` mock gap is fixed — `@bantay/core` mock now includes a `getGitContext` stub, so `pnpm --filter @bantay/cli test` passes (3/3). Full repo: `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm test` (47/47 across both packages), `pnpm run -r --if-present lint`, `typecheck`, and `format:check` all pass clean on Node 22 / pnpm 10.

## Remaining decision gates

- Resolve KEEP vs ARCHIVE before any remote archival.
- If kept, use this as the consolidation target for SecretCycle concepts only after a product/spec decision.
- If archived, freeze the README/architecture claims against the exact implemented behavior and remove/close active roadmap promises.
