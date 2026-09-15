/**
 * The public call to action.
 *
 * clipworker is invite-only: enforce_user_cap() in the database refuses any
 * signup whose address an admin has not already added to a workspace (see
 * sql/provisioning.sql). "Get started free" pointing at /login was therefore a
 * dead end -- the visitor arrives at a form that cannot succeed, which is worse
 * than not offering it.
 *
 * Every "Request access" and "Get a demo" button goes to the request form,
 * which stores the request and emails the team (app/api/request-access).
 *
 * Defined once, here, because the same button appears in the nav, the hero and
 * the closing band, and three copies is how a site ends up half-migrated.
 */
export const CTA_LABEL = "Request access";

export const CTA_HREF = "/request-access";
