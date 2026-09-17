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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHANNEL_DATATYPES, ChannelDatatype } from "@/lib/constants";
import { Id } from "../../convex/_generated/dataModel";

export function CreateChannelDialog({ subsystemId, children }: { subsystemId: string, children: React.ReactNode }) {
  const createChannel = useMutation(api.telemetryChannels.create)
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [unit, setUnit] = useState("")
  const [datatype, setDatatype] = useState("float")
  const [samplingRate, setSamplingRate] = useState("1")
  const [minValue, setMinValue] = useState("")
  const [maxValue, setMaxValue] = useState("")
  const [description, setDescription] = useState("")
interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spacecraftId: Id<"spacecraft">;
  subsystemId: Id<"subsystems">;
}

export function CreateChannelDialog({ open, onOpenChange, spacecraftId, subsystemId }: CreateChannelDialogProps) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("V");
  const [datatype, setDatatype] = useState<ChannelDatatype>("float");
  const [samplingRate, setSamplingRate] = useState("1");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const createChannel = useMutation(api.telemetryChannels.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createChannel({
      subsystemId,
      name,
      unit,
      datatype,
      samplingRate: parseFloat(samplingRate),
      minValue: minValue ? parseFloat(minValue) : undefined,
      maxValue: maxValue ? parseFloat(maxValue) : undefined,
      description
    })
    setOpen(false)
    setName("")
    setUnit("")
    setDatatype("float")
    setSamplingRate("1")
    setMinValue("")
    setMaxValue("")
    setDescription("")
  }
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Telemetry Channel</DialogTitle>
          <DialogDescription>
            Configure a data channel for this subsystem to monitor incoming telemetry data points.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
          <div className="grid gap-2">
            <Label htmlFor="name">Channel Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        <form onSubmit={handleSubmit} className="space-y-3 py-2 text-slate-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ch-name">Channel Name</Label>
              <Input
                id="ch-name"
                placeholder="e.g. battery_voltage"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="ch-unit">Unit</Label>
              <Input
                id="ch-unit"
                placeholder="e.g. V, A, °C, %"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unit">Unit (e.g. V, A, °C)</Label>
            <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ch-datatype">Datatype</Label>
              <select
                id="ch-datatype"
                className="flex h-9 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-1 text-sm text-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                value={datatype}
                onChange={(e) => setDatatype(e.target.value as ChannelDatatype)}
              >
                {CHANNEL_DATATYPES.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="ch-rate">Sampling Rate (Hz)</Label>
              <Input
                id="ch-rate"
                type="number"
                step="0.1"
                placeholder="1.0"
                value={samplingRate}
                onChange={(e) => setSamplingRate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="datatype">Datatype</Label>
            <Select value={datatype} onValueChange={setDatatype}>
              <SelectTrigger>
                <SelectValue placeholder="Select datatype" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="float">Float</SelectItem>
                <SelectItem value="integer">Integer</SelectItem>
                <SelectItem value="boolean">Boolean</SelectItem>
                <SelectItem value="string">String</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="samplingRate">Sampling Rate (Hz)</Label>
            <Input id="samplingRate" type="number" step="0.1" value={samplingRate} onChange={(e) => setSamplingRate(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="minValue">Min Value</Label>
              <Input id="minValue" type="number" step="any" value={minValue} onChange={(e) => setMinValue(e.target.value)} />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="ch-min">Min Value Threshold</Label>
              <Input
                id="ch-min"
                type="number"
                step="any"
                placeholder="e.g. 0.0"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maxValue">Max Value</Label>
              <Input id="maxValue" type="number" step="any" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} />
            <div className="space-y-1">
              <Label htmlFor="ch-max">Max Value Threshold</Label>
              <Input
                id="ch-max"
                type="number"
                step="any"
                placeholder="e.g. 8.4"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="space-y-1">
            <Label htmlFor="ch-desc">Description</Label>
            <Input
              id="ch-desc"
              placeholder="Primary battery pack terminal voltage"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit">Add Channel</Button>

          <DialogFooter className="pt-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading ? "Adding..." : "Add Channel"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
  );
}
