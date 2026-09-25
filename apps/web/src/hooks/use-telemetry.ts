"use client";

import { useEffect, useRef, useState } from "react";

export type TelemetryData = {
  battery_voltage: number;
  battery_current: number;
  battery_temperature: number;
  bus_voltage: number;
  state_of_charge: number;

  obc_cpu_utilization: number;
  obc_temperature: number;
  obc_memory_utilization: number;
  reboot_count: number;

  angular_velocity_x: number;
  angular_velocity_y: number;
  angular_velocity_z: number;
  attitude_error: number;
  reaction_wheel_speed: number;

  rssi: number;
  packet_loss: number;
  uplink_count: number;
  downlink_count: number;

  payload_temperature: number;
};

export type TelemetryPacket = {
  missionId: string;
  spacecraftId: string;
  timestamp: string;
  source: "simulator" | "ground_station" | "external";
  sequence: number;
  telemetry: TelemetryData;
};

export type RCAResult = {
  status: "no_issue" | "suspected" | "confirmed_simulation";

  subsystem: string | null;
  candidate_cause: string | null;
  confidence: number;
  evidence: string[];
};

export type ChannelAnomaly = {
  channel: string;
  value: number;
  z_score: number;
  severity: "normal" | "warning" | "critical";
};

export type AnomalyResult = {
  spacecraftId: string;
  timestamp: string;
  detector: string;
  score: number;
  severity: "normal" | "warning" | "critical";
  affectedChannels: string[];
  channels: ChannelAnomaly[];
};

export type MissionStreamPacket = {
  telemetry: TelemetryPacket;
  anomaly: AnomalyResult;
  rca: RCAResult;
};

const [rca, setRca] = useState<RCAResult | null>(null);

const MAX_HISTORY = 60;

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState<TelemetryPacket | null>(null);

  const [history, setHistory] = useState<TelemetryPacket[]>([]);

  const [anomaly, setAnomaly] = useState<AnomalyResult | null>(null);

  const [anomalyHistory, setAnomalyHistory] = useState<AnomalyResult[]>([]);

  const [connected, setConnected] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/mission");

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to COSMOS mission stream.");
      setConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const packet: MissionStreamPacket = JSON.parse(event.data);

        setTelemetry(packet.telemetry);

        setAnomaly(packet.anomaly);
        setRca(packet.rca);

        setHistory((previous) => {
          const next = [...previous, packet.telemetry];

          if (next.length > MAX_HISTORY) {
            return next.slice(-MAX_HISTORY);
          }

          return next;
        });

        setAnomalyHistory((previous) => {
          const next = [...previous, packet.anomaly];

          if (next.length > MAX_HISTORY) {
            return next.slice(-MAX_HISTORY);
          }

          return next;
        });
      } catch (err) {
        console.error("Invalid mission stream packet:", err);
      }
    };

    socket.onerror = () => {
      setError("Unable to connect to COSMOS mission stream.");
      setConnected(false);
    };

    socket.onclose = () => {
      console.log("Mission stream closed.");
      setConnected(false);
    };

    return () => {
      socket.close();
      socketRef.current = null;
    };
  }, []);

  return {
    telemetry,
    history,
    anomaly,
    anomalyHistory,
    rca,
    connected,
    error,
  };
}
