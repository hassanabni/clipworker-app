import Link from "next/link";
import { MyClips } from "@/components/my-clips";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <>
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b bg-background/80 px-8 py-3.5 backdrop-blur">
        <div>
          <h1 className="font-medium">My clips</h1>
          <p className="text-xs text-muted-foreground">Links stay live for 30 days.</p>
        </div>
        <Button size="sm" asChild><Link href="/app">New clip</Link></Button>
      </header>
      <div className="mx-auto max-w-4xl px-8 py-8">
        <MyClips limit={60} />
      </div>
    </>
  );
}
