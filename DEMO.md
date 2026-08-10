# FerretOps demo — Bantay (Gate)

Bantay is the **Gate** half of FerretOps: block secrets before `git push`.
SecretCycle is the **Cycle** half: rotate once at the source of truth and fan out to bindings.

## One path (offline, synthetic secrets only)

The end-to-end script lives in [secretcycle](https://github.com/kuyacarlo/secretcycle) as
`scripts/ferretops-demo.sh`. It:

1. Rotates a **fixture** database URL with `ferretctl` (memory adapter — no cloud).
2. Stages a **synthetic** AWS access key (`AKIA…EXAMPLE`) in a throwaway git repo.
3. Runs `bantay scan --local` and expects **exit 1** (push blocked).
4. Removes the leak and expects **exit 0** (push allowed).

```bash
# From a checkout of both repos (sibling dirs or set BANTAY_ROOT / SECRET CYCLE_ROOT)
export BANTAY_ROOT=/path/to/bantay
export SECRETCYCLE_ROOT=/path/to/secretcycle
bash "$SECRETCYCLE_ROOT/scripts/ferretops-demo.sh"
```

### Local gate without Auth0

```bash
pnpm install && pnpm build
bantay scan --local          # uncommitted changes
bantay scan --local --staged
```

`--local` uses regex + secretlint only. No Auth0, LLM, or CIBA. Medium risk fails closed
(exit 1). Full human-in-the-loop remains the default `bantay scan` after `bantay login`.

**Never use real credentials in this demo.** Fixture values only.

## See also

- [SecretCycle DEMO.md](https://github.com/kuyacarlo/secretcycle/blob/main/DEMO.md)
- [SecretCycle README](https://github.com/kuyacarlo/secretcycle#readme)
- [Bantay README](./README.md)
