/** The one place the public contact address is defined.
 *
 * It appears on the privacy policy, terms and refund pages, and on the
 * "no workspace yet" screen, which is the address a newly invited user writes
 * to when their membership has not been wired up.
 *
 * ablyst.com rather than clipworker.xyz on purpose: it is an existing Google
 * Workspace domain with MX and SPF already configured, so it receives mail
 * today with nothing to set up. A role address also keeps a personal inbox off
 * a public page -- anything published on a privacy policy gets scraped, and
 * once it is out there it cannot be taken back.
 *
 * Being on a different domain from the product is normal and does not affect
 * Paddle or Stripe. Swap it for support@clipworker.xyz whenever that mailbox
 * exists; this is the only line that needs to change.
 */
export const CONTACT_EMAIL = "support@ablyst.com";
