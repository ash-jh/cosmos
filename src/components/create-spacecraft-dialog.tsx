"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Id } from "../../convex/_generated/dataModel";

interface CreateSpacecraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  missionId: Id<"missions">;
}

export function CreateSpacecraftDialog({ open, onOpenChange, missionId }: CreateSpacecraftDialogProps) {
  const [name, setName] = useState("");
  const [noradId, setNoradId] = useState("");
  const [loading, setLoading] = useState(false);

  const createSpacecraft = useMutation(api.spacecraft.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await createSpacecraft({
        missionId,
        name: name.trim(),
        noradId: noradId.trim() || undefined,
      });
      setName("");
      setNoradId("");
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to create spacecraft:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register Spacecraft</DialogTitle>
          <DialogDescription>
            Add a spacecraft satellite unit to this mission to monitor telemetry subsystems and perform digital twin diagnostics.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="sc-name">Spacecraft Name</Label>
            <Input
              id="sc-name"
              placeholder="e.g. COSMOS-SAT-01"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="norad-id">NORAD ID (Optional)</Label>
            <Input
              id="norad-id"
              placeholder="e.g. 59001"
              value={noradId}
              onChange={(e) => setNoradId(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Registering..." : "Register Spacecraft"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

