@AGENTS.md

# clipworker-app

Read `HANDOFF.md` first, starting with its **CURRENT STATUS** block. The
worker/backend is `~/Downloads/clip-worker`, which has its own `HANDOFF.md`.
Both repos share one Supabase project and one R2 bucket.

## Keep HANDOFF.md current (user requirement)

After ANY change, update `HANDOFF.md` in the same session, before finishing.
That covers code, SQL applied to the live database, env vars, deploys and
pushes, and anything learned the hard way. Record:

- what changed and why;
- whether it is committed, pushed, deployed, or local only;
- what is still open.

Refresh the CURRENT STATUS block and add a dated session-log entry. A new chat
must be able to continue from `HANDOFF.md` alone. If a change also touches the
worker, update `clip-worker/HANDOFF.md` too.

Do not deploy or push unless the user asks. `main` deploys to production.
