export const metadata = { title: "Refund Policy — Clip Worker" };

const UPDATED = "31 August 2026";
const CONTACT = "support@clipworker.xyz";

export default function Refunds() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Refund Policy</h1>
      <p className="text-muted-foreground">Last updated {UPDATED}</p>

      <h2>Try it free first</h2>
      <p>
        Every account gets free clips before paying anything. That is
        deliberate: you should know whether Clip Worker works on your footage
        before you subscribe, because whether a clip lands is a matter of taste
        and your material.
      </p>

      <h2>14-day refund</h2>
      <p>
        If you subscribe and are not happy, email us within{" "}
        <strong>14 days of your first payment</strong> and we will refund it in
        full. You do not need to explain why.
      </p>

      <h2>After 14 days</h2>
      <p>
        Subscriptions renew monthly. You can cancel at any time and keep access
        until the end of the period you have already paid for. We do not
        pro-rate part-months by default.
      </p>
      <p>
        If something went wrong on our side — clips failing, the service being
        down, being charged after cancelling — tell us and we will put it right,
        including refunding the affected period. That is not limited to 14 days.
      </p>

      <h2>What is not refundable</h2>
      <ul>
        <li>
          Renewals you forgot to cancel, beyond the 14-day window — though if
          you have not used the service at all that month, ask us anyway.
        </li>
        <li>
          Accounts closed for breaching the{" "}
          <a className="underline" href="/terms">
            terms
          </a>
          , such as uploading content you had no right to use.
        </li>
      </ul>

      <h2>How to ask</h2>
      <p>
        Email{" "}
        <a className="underline" href={`mailto:${CONTACT}`}>
          {CONTACT}
        </a>{" "}
        from the address on your account. Refunds go back to the original
        payment method, and typically take 5&ndash;10 days to appear depending
        on your bank.
      </p>
      <p>
        Payments are processed by our payment provider, so a refund may appear
        on your statement under their name rather than ours.
      </p>

      <h2>Your statutory rights</h2>
      <p>
        Nothing in this policy affects rights you have under consumer law in
        your country, including any statutory cooling-off period.
      </p>
    </>
  );
}
