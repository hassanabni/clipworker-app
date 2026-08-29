import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Server-only. These are write-capable credentials with no NEXT_PUBLIC_ prefix,
// so Next will not inline them into a client bundle.
const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
export const BUCKET = process.env.R2_BUCKET ?? "clip-worker";

export class NotConfigured extends Error {}

export const r2 = () => {
  if (!endpoint || !accessKeyId || !secretAccessKey)
    throw new NotConfigured(
      "R2 is not configured in web/.env.local. Run: .venv/bin/python scripts/set_r2_keys.py " +
        "(then restart `npm run dev`)"
    );
  // region "auto": R2 has no regions, but SigV4 requires the field.
  return new S3Client({
    region: "auto", endpoint,
    credentials: { accessKeyId, secretAccessKey },
    // AWS SDK v3.729+ computes a CRC32 checksum for PutObject by default and
    // bakes it into the presigned URL as x-amz-checksum-crc32. At signing time
    // there is no body, so the value is AAAAAA== -- the CRC32 of zero bytes.
    // The browser then PUTs real bytes, R2 compares them against a checksum for
    // an empty payload, and rejects the upload. Turning checksums off unless a
    // request actually requires them removes the parameter entirely.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
};

// contentLength is SIGNED into the URL, which is what makes the size limit real.
// Without it the presigned URL accepts a body of any length, so the only cap was
// a constant in the browser -- and anyone who can sign in can skip the browser.
// R2 compares the actual Content-Length against the signed one and rejects a
// mismatch, so a caller cannot declare 100MB and then send 50GB.
export const presignPut = (key: string, contentType: string, contentLength: number) =>
  getSignedUrl(
    r2(),
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ContentType: contentType,
      ContentLength: contentLength,
    }),
    { expiresIn: 3600 }
  );

export const presignGet = (key: string) =>
  getSignedUrl(r2(), new GetObjectCommand({ Bucket: BUCKET, Key: key }), { expiresIn: 3600 });
