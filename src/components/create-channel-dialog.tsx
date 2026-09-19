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

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spacecraftId: Id<"spacecraft">;
  subsystemId: Id<"subsystems">;
}

export function CreateChannelDialog({
  open,
  onOpenChange,
  spacecraftId,
  subsystemId,
}: CreateChannelDialogProps) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("V");
  const [datatype, setDatatype] = useState<"float" | "integer" | "boolean" | "string">("float");
  const [samplingRate, setSamplingRate] = useState("1");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createChannel = useMutation(api.telemetryChannels.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await createChannel({
        spacecraftId,
        subsystemId,
        name: name.trim(),
        unit: unit.trim(),
        datatype,
        samplingRate: parseFloat(samplingRate) || 1,
        minValue: minValue !== "" ? parseFloat(minValue) : undefined,
        maxValue: maxValue !== "" ? parseFloat(maxValue) : undefined,
        description: description.trim() || undefined,
      });
      setName("");
      setUnit("V");
      setDescription("");
      onOpenChange(false);
    } catch (err) {
      console.error("Failed to create telemetry channel:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Add Telemetry Channel</DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Configure a data channel for this subsystem to monitor incoming telemetry data points.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 py-2 text-slate-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ch-name" className="text-xs text-slate-300">Channel Name</Label>
              <Input
                id="ch-name"
                placeholder="e.g. battery_voltage"
                className="bg-slate-950/60 border-slate-800 text-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ch-unit" className="text-xs text-slate-300">Unit</Label>
              <Input
                id="ch-unit"
                placeholder="e.g. V, A, °C, %"
                className="bg-slate-950/60 border-slate-800 text-xs"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-slate-300">Data Type</Label>
              <select
                className="w-full h-9 rounded-md bg-slate-950/60 border border-slate-800 text-xs px-3 text-slate-200"
                value={datatype}
                onChange={(e) => setDatatype(e.target.value as any)}
              >
                <option value="float">Float</option>
                <option value="integer">Integer</option>
                <option value="boolean">Boolean</option>
                <option value="string">String</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="ch-rate" className="text-xs text-slate-300">Rate (Hz)</Label>
              <Input
                id="ch-rate"
                type="number"
                step="0.1"
                className="bg-slate-950/60 border-slate-800 text-xs"
                value={samplingRate}
                onChange={(e) => setSamplingRate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ch-min" className="text-xs text-slate-300">Min Threshold</Label>
              <Input
                id="ch-min"
                type="number"
                step="any"
                placeholder="Nominal min"
                className="bg-slate-950/60 border-slate-800 text-xs"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ch-max" className="text-xs text-slate-300">Max Threshold</Label>
              <Input
                id="ch-max"
                type="number"
                step="any"
                placeholder="Nominal max"
                className="bg-slate-950/60 border-slate-800 text-xs"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="ch-desc" className="text-xs text-slate-300">Description</Label>
            <Input
              id="ch-desc"
              placeholder="Brief description of channel"
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
              {loading ? "Adding..." : "Add Channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
