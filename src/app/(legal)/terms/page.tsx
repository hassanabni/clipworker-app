export const metadata = { title: "Terms of Service — Clip Worker" };

const UPDATED = "31 August 2026";
const CONTACT = "support@clipworker.xyz";

export default function Terms() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Terms of Service</h1>
      <p className="text-muted-foreground">Last updated {UPDATED}</p>

      <p>
        These terms cover your use of Clip Worker. By creating an account you
        agree to them.
      </p>

      <h2>What the service does</h2>
      <p>
        You upload a video and either describe the moment you want or let us
        choose one. We transcribe the video, pick a moment, crop it to vertical,
        add captions, and give you the result to download.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You must be at least 16 to use Clip Worker.</li>
        <li>
          Keep your login details to yourself. You are responsible for what
          happens under your account.
        </li>
        <li>One person or business per account.</li>
      </ul>

      <h2>The footage you upload</h2>
      <p>
        This is the part that matters most, so it is stated plainly:{" "}
        <strong>
          you must have the right to use every video, image and piece of music
          you upload.
        </strong>{" "}
        That means you own it, or you have permission from whoever does, or its
        licence permits what you are doing.
      </p>
      <p>
        Uploading someone else&rsquo;s content without permission is your
        responsibility, not ours. If we receive a valid complaint from a rights
        holder we may remove the material and suspend the account.
      </p>
      <p>You also agree not to upload material that:</p>
      <ul>
        <li>is unlawful, or depicts abuse of any kind</li>
        <li>contains sexual content involving minors — reported without exception</li>
        <li>is designed to harass, defame or impersonate someone</li>
        <li>you obtained by breaking into somewhere or someone&rsquo;s account</li>
      </ul>

      <h2>Who owns the output</h2>
      <p>
        <strong>You do.</strong> We claim no rights over your uploads or the
        clips we produce from them. There is no watermark and no restriction on
        commercial use. We only process your files to provide the service.
      </p>

      <h2>Plans and limits</h2>
      <p>
        Free accounts get a fixed number of clips. Paid plans get a monthly
        allowance shown on the pricing page. Upload size and video length limits
        apply and are enforced when you upload; current limits are shown in the
        app.
      </p>
      <p>
        We may change prices, and will give at least 30 days&rsquo; notice by
        email before a change affects an existing subscription.
      </p>

      <h2>Availability</h2>
      <p>
        Clip Worker is early software. We do not promise a particular uptime,
        turnaround time, or that a clip will meet your expectations — the choice
        of moment is made by a model and will sometimes be wrong. Rendering
        times vary with the length and resolution of your video.
      </p>
      <p>
        We may change or discontinue features. If we shut the service down we
        will give you reasonable notice and time to download your clips.
      </p>

      <h2>Suspension</h2>
      <p>
        We may suspend or close an account that breaks these terms, abuses the
        service in a way that degrades it for others, or attempts to circumvent
        limits. Where it is reasonable to do so, we will tell you why first.
      </p>

      <h2>Liability</h2>
      <p>
        The service is provided as-is. To the extent the law allows, we are not
        liable for lost profits, lost content, or indirect losses, and our total
        liability is limited to what you paid us in the 12 months before the
        claim.
      </p>
      <p>
        Nothing here limits liability that cannot be limited by law, including
        for death or personal injury caused by negligence, or for fraud.
      </p>

      <h2>Cancelling</h2>
      <p>
        You can cancel a subscription at any time; it stays active until the end
        of the period you have paid for. See our{" "}
        <a className="underline" href="/refunds">
          refund policy
        </a>
        .
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We will post changes here and update the date above. For material
        changes we will email you.
      </p>

      <h2>Contact</h2>
      <p>
        <a className="underline" href={`mailto:${CONTACT}`}>
          {CONTACT}
        </a>
      </p>
    </>
  );
}
