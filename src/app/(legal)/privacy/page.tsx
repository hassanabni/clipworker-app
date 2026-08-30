import { CONTACT_EMAIL as CONTACT } from "@/lib/contact";

export const metadata = { title: "Privacy Policy — Clip Worker" };

const UPDATED = "31 August 2026";

export default function Privacy() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated {UPDATED}</p>

      <p>
        Clip Worker turns a long video into a short vertical clip. This page
        explains what we do with the video you upload and the account details
        you give us. It describes what the service actually does today, not what
        it might do later.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Your account.</strong> An email address, and if you sign in
          with Google, the name and profile picture Google shares. Passwords are
          handled by our authentication provider and we never see them.
        </li>
        <li>
          <strong>The videos you upload,</strong> plus any b-roll or music you
          add, and the description you type of the moment you want.
        </li>
        <li>
          <strong>Job records</strong> — when a clip was made, whether it
          succeeded, and technical notes about how it was produced.
        </li>
        <li>
          <strong>Waitlist entries.</strong> If you joined the waitlist we store
          your email, which page you signed up from, and the referring site.
        </li>
      </ul>
      <p>
        We do not use analytics or advertising trackers, and we do not sell your
        data or share it for marketing.
      </p>

      <h2>How long we keep your video</h2>
      <ul>
        <li>
          <strong>Source uploads are deleted as soon as your clip is
          rendered.</strong> If a job fails or is abandoned, the upload is
          deleted automatically within 24 hours.
        </li>
        <li>
          <strong>Finished clips are kept for 30 days,</strong> then deleted.
          Download anything you want to keep.
        </li>
        <li>Job records and your account persist until you delete your account.</li>
      </ul>

      <h2>Who else processes your data</h2>
      <p>
        We use a small number of providers to run the service. Each receives
        only what it needs:
      </p>
      <ul>
        <li>
          <strong>OpenAI</strong> — to choose which moment of your video makes
          the best clip, <strong>the text transcript of your video is sent to
          OpenAI</strong>. The video itself is never sent. If your recording
          contains something you would not want processed by a third party,
          please do not upload it.
        </li>
        <li>
          <strong>Supabase</strong> — accounts and job records, hosted in
          Singapore (AWS ap-southeast-1).
        </li>
        <li>
          <strong>Cloudflare R2</strong> — storage for uploads and finished
          clips.
        </li>
        <li>
          <strong>Vercel</strong> — website hosting.
        </li>
        <li>
          <strong>Brevo</strong> — sign-in and password-reset emails.
        </li>
        <li>
          <strong>Our payment provider</strong> — if you subscribe. We never see
          or store your card details.
        </li>
      </ul>
      <p>
        Transcription, face tracking and video rendering all happen on our own
        infrastructure, not a third party.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask us for a copy of your data, ask us to correct it, or ask us
        to delete your account and everything attached to it. Email{" "}
        <a className="underline" href={`mailto:${CONTACT}`}>
          {CONTACT}
        </a>{" "}
        and we will action it within 30 days. Deleting your account removes your
        job records and any clips still in storage.
      </p>
      <p>
        If you are in the UK or EU, you also have the right to object to
        processing and to complain to your local data protection authority.
      </p>

      <h2>Security</h2>
      <p>
        Uploads go straight to storage over an encrypted connection, using a
        short-lived link scoped to your account. Clips are served through
        expiring links. Access is enforced at the database level, so one account
        cannot read another&rsquo;s files or job history.
      </p>

      <h2>Children</h2>
      <p>
        Clip Worker is not intended for anyone under 16, and we do not knowingly
        collect their data.
      </p>

      <h2>Changes</h2>
      <p>
        If we change how we handle your data we will update this page, and for
        anything significant we will email you before it takes effect.
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