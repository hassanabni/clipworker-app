"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Mail, Trash2, UserPlus } from "lucide-react";

export type Person = {
  user_id: string | null;
  email: string;
  role: string;
  joined: boolean;
  created_at: string;
};

const ROLE_BLURB: Record<string, string> = {
  owner: "Everything, including managing owners.",
  admin: "Can invite and remove people.",
  member: "Can make clips and see the library.",
};

/**
 * Who is in the workspace.
 *
 * Members and unredeemed invitations are one list on purpose: to the person
 * running a pilot they are the same question -- "who has access?" -- and
 * splitting them into two tables makes an invitation look like a different kind
 * of thing rather than a member who has not arrived yet.
 */
export function TeamPanel({ initialPeople, myRole, myUserId }: {
  initialPeople: Person[];
  myRole: string;
  myUserId: string;
}) {
  // Seeded from the server render, then kept up to date by the handlers below.
  // Reloading in an effect would mean fetching on first paint what the page
  // already arrived holding.
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [busy, setBusy] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);

  const canManage = myRole === "owner" || myRole === "admin";

  /** Re-read the list after a change. Called from event handlers only. */
  async function reload() {
    try {
      const r = await fetch("/api/team");
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      setPeople(j.people ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not refresh the team.");
    }
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      toast.success(
        j.result === "attached"
          ? `${email} already had an account and is now in this workspace.`
          : `Invited ${email}. They can create an account with that address.`);
      setEmail("");
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not invite them.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(p: Person) {
    setRemoving(p.email);
    try {
      const r = await fetch("/api/team", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p.joined ? { userId: p.user_id } : { email: p.email }),
      });
      const j = await r.json();
      if (j.error) throw new Error(j.error);
      toast.success(p.joined ? `Removed ${p.email}.` : `Invitation to ${p.email} withdrawn.`);
      await reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not remove them.");
    } finally {
      setRemoving(null);
    }
  }

  return (
    <div className="space-y-6">
      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Invite someone</CardTitle>
            <CardDescription>
              They create their own account with this address. Everyone in the
              workspace shares the same brand kit and clip library.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={invite} className="flex flex-wrap items-end gap-3">
              <div className="min-w-56 flex-1 space-y-2">
                <Label htmlFor="invite-email">Work email</Label>
                <Input id="invite-email" type="email" required value={email}
                       placeholder="colleague@company.com" disabled={busy}
                       onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="w-40 space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="invite-role" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {/* Only an owner may mint another owner; the database
                        refuses it either way, so hiding it just avoids
                        offering a button that always fails. */}
                    {myRole === "owner" && <SelectItem value="owner">Owner</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                Invite
              </Button>
            </form>
            <p className="text-muted-foreground mt-3 text-xs">
              {ROLE_BLURB[role]}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            People <span className="text-muted-foreground font-normal">({people.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
              {people.map((p) => (
                <li key={p.email} className="flex items-center gap-3 py-3">
                  <div className="bg-muted grid size-8 shrink-0 place-items-center rounded-full text-xs font-medium uppercase">
                    {p.joined ? p.email.slice(0, 2) : <Mail className="size-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">
                      {p.email}
                      {p.user_id === myUserId && (
                        <span className="text-muted-foreground"> · you</span>
                      )}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {p.joined
                        ? `Joined ${new Date(p.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
                        : "Invited — hasn't created an account yet"}
                    </div>
                  </div>
                  <Badge variant={p.joined ? "secondary" : "outline"} className="shrink-0 capitalize">
                    {p.role}
                  </Badge>
                  {canManage && p.user_id !== myUserId && (
                    <Button variant="ghost" size="sm" disabled={removing === p.email}
                            aria-label={p.joined ? `Remove ${p.email}` : `Withdraw invitation to ${p.email}`}
                            onClick={() => void remove(p)}>
                      {removing === p.email
                        ? <Loader2 className="size-4 animate-spin" />
                        : <Trash2 className="text-muted-foreground size-4" />}
                    </Button>
                  )}
                </li>
              ))}
          </ul>
        </CardContent>
      </Card>

      {!canManage && (
        <p className="text-muted-foreground text-xs">
          Only an owner or admin can invite or remove people.
        </p>
      )}
    </div>
  );
}
