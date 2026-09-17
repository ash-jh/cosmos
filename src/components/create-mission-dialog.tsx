"use client"
"use client";

import { useState } from "react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MISSION_TYPES, MissionType } from "@/lib/constants";
import { Id } from "../../convex/_generated/dataModel";

export function CreateMissionDialog({ children }: { children: React.ReactNode }) {
  const createMission = useMutation(api.missions.create)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [type, setType] = useState("CubeSat")
  const [description, setDescription] = useState("")
interface CreateMissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: Id<"organizations">;
}

export function CreateMissionDialog({ open, onOpenChange, organizationId }: CreateMissionDialogProps) {
  const [name, setName] = useState("");
  const [missionType, setMissionType] = useState<MissionType>("cubesat");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createMission = useMutation(api.missions.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createMission({ name, type, description })
    setOpen(false)
    setName("")
    setType("CubeSat")
    setDescription("")
  }
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await createMission({
        organizationId,
        name: name.trim(),
        missionType,
        description: description.trim() || undefined,
      });
      setName("");
      setDescription("");
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to create mission:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Mission</DialogTitle>
          <DialogTitle>Register New Mission</DialogTitle>
          <DialogDescription>
            Define a satellite mission under your organization to begin managing spacecraft telemetry and operations.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="mission-name">Mission Name</Label>
            <Input
              id="mission-name"
              placeholder="e.g. RVCE CubeSat-01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Mission Type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CubeSat">CubeSat</SelectItem>
                <SelectItem value="SmallSat">SmallSat</SelectItem>
                <SelectItem value="CanSat">CanSat</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

          <div className="space-y-1.5">
            <Label htmlFor="mission-type">Mission Type</Label>
            <select
              id="mission-type"
              className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
              value={missionType}
              onChange={(e) => setMissionType(e.target.value as MissionType)}
            >
              {MISSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="space-y-1.5">
            <Label htmlFor="mission-desc">Description</Label>
            <textarea
              id="mission-desc"
              rows={3}
              className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
              placeholder="Mission goals, orbital payload parameters..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit">Create Mission</Button>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Creating..." : "Create Mission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
  );
}
