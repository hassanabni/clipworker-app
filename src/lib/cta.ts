import { CONTACT_EMAIL } from "@/lib/contact";

/**
 * The public call to action.
 *
 * clipworker is invite-only: enforce_user_cap() in the database refuses any
 * signup whose address an admin has not already added to a workspace (see
 * sql/provisioning.sql). "Get started free" pointing at /login was therefore a
 * dead end -- the visitor arrives at a form that cannot succeed, which is worse
 * than not offering it.
 *
 * Defined once, here, because the same button appears in the nav, the hero and
 * the closing band, and three copies is how a site ends up half-migrated.
 */
export const CTA_LABEL = "Request access";

export const CTA_HREF =
  `mailto:${CONTACT_EMAIL}` +
  "?subject=" + encodeURIComponent("clipworker access request") +
  "&body=" + encodeURIComponent(
    "Hi — I'd like to try clipworker for our team.\n\n" +
    "Company:\nWhat we'd use it for:\nRough number of people:\n");
