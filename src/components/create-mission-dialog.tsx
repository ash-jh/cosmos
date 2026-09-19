"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Id } from "../../convex/_generated/dataModel";

interface CreateMissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: Id<"organizations">;
}

export function CreateMissionDialog({
  open,
  onOpenChange,
  organizationId,
}: CreateMissionDialogProps) {
  const [name, setName] = useState("");
  const [missionType, setMissionType] = useState<"cubesat" | "smallsat" | "cansat" | "other">("cubesat");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createMission = useMutation(api.missions.create);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Register New Mission</DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Define a satellite mission under your organization to begin managing spacecraft telemetry.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="mission-name" className="text-xs text-slate-300">Mission Name</Label>
            <Input
              id="mission-name"
              placeholder="e.g. RVCE CubeSat-01"
              className="bg-slate-950/60 border-slate-800 text-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-slate-300">Mission Class</Label>
            <select
              className="w-full h-9 rounded-md bg-slate-950/60 border border-slate-800 text-xs px-3 text-slate-200"
              value={missionType}
              onChange={(e) => setMissionType(e.target.value as any)}
            >
              <option value="cubesat">CubeSat (1U-6U)</option>
              <option value="smallsat">SmallSat (&lt;100kg)</option>
              <option value="cansat">CanSat Prototype</option>
              <option value="other">Experimental</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="mission-desc" className="text-xs text-slate-300">Description</Label>
            <Input
              id="mission-desc"
              placeholder="Primary mission objectives and payload focus"
              className="bg-slate-950/60 border-slate-800 text-xs"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="border-slate-800 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs"
            >
              {loading ? "Registering..." : "Create Mission"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
