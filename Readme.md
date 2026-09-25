# COSMOS: Mission Operations & Spacecraft Health Platform

> **Turn raw spacecraft telemetry into actionable mission intelligence — from anomaly detection and correlation to root-cause investigation and simulated recovery.**

COSMOS is an open mission-operations and telemetry-intelligence platform built around a university CubeSat mission specification. The system is designed to process streaming telemetry, detect anomalies using layered statistical and machine-learning models, and assist mission operators with automated Root Cause Analysis (RCA) and digital-twin fault simulation.

---

## Table of Contents

- [What is COSMOS?](#what-is-cosmos)
- [Core Capabilities](#core-capabilities)
- [Current Implementation Status](#current-implementation-status)
- [System Architecture](#system-architecture)
  - [Telemetry Pipeline](#telemetry-pipeline)
  - [Canonical Telemetry Schema](#canonical-telemetry-schema)
- [Spacecraft Simulation](#spacecraft-simulation)
- [Anomaly Detection & RCA Engine](#anomaly-detection--rca-engine)
  - [Statistical Baseline](#statistical-baseline)
  - [Root Cause Analysis (RCA)](#root-cause-analysis-rca)
  - [Supported Fault Scenarios](#supported-fault-scenarios)
- [ML & Edge AI Research Direction](#ml--edge-ai-research-direction)
- [Repository Structure](#repository-structure)
- [Technology Stack](#technology-stack)
- [Local Development Setup](#local-development-setup)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Execution](#step-by-step-execution)
- [API Endpoints & Operational Flow](#api-endpoints--operational-flow)
- [Safety Boundary & Limitations](#safety-boundary--limitations)
- [Project Roadmap](#project-roadmap)
- [Architecture Principles](#architecture-principles)

---

## What is COSMOS?

COSMOS addresses the operational challenge of treating telemetry as more than isolated, disconnected charts. Instead, it provides an end-to-end intelligence pipeline:

```text
Telemetry ──► Health Monitoring ──► Anomaly Detection ──► Multi-Parameter Correlation ──► Affected Subsystem
                                                                                              │
Simulated Recovery ◄── Fault Simulation ◄── Operator Investigation ◄── Candidate Root Cause ◄┘
        │
        ▼
Recovery Verification
```

### Core Goals

- **Mission Operations:** Provide a real-time console to observe spacecraft health, evaluate detected anomalies, and run non-destructive recovery scenarios via a digital twin.
- **Edge AI Research:** Benchmark lightweight temporal deep-learning models (LSTM, TCN) for edge deployment under strict compute, memory, and power constraints typical of CubeSat flight software.

---

## Core Capabilities

- **Mission Hierarchy Modeling:** Structured representation of Organization $\rightarrow$ Mission $\rightarrow$ Spacecraft $\rightarrow$ Subsystem $\rightarrow$ Telemetry Channel.
- **Live Telemetry Engine:** Python-backed simulator streaming ~1 Hz telemetry over WebSockets.
- **Subsystem Metrics Monitored:**
  - **EPS:** Battery voltage, current, temperature, bus voltage, state of charge (SoC).
  - **OBC:** CPU utilization, OBC temperature, memory usage, reboot count.
  - **ADCS:** Angular velocity ($X, Y, Z$), attitude error, reaction wheel speed.
  - **COMM:** Signal strength (RSSI), packet loss, uplink/downlink telemetry frame counts.
  - **Payload / Thermal:** Payload board temperatures coupled with system heat output.
- **Simulated Fault Injection:** Interactive console to induce physical and electrical degradation in real time.
- **Rule-Based Correlation:** Automated candidate root-cause generation from cross-channel anomaly vectors.

---

## Current Implementation Status

| Component / Feature | Implementation Status | Stage Details |
| :--- | :--- | :--- |
| **Next.js Frontend** | Implemented | Dark mission-control UI console |
| **Convex App State** | Implemented | Schema setup for missions, alerts, and state |
| **Telemetry Pipeline** | Implemented | Canonical JSON telemetry contract |
| **Spacecraft Simulator** | Implemented | EPS, OBC, ADCS, COMM, and Thermal dynamics |
| **FastAPI Service** | Implemented | REST endpoints + WebSocket streaming |
| **Fault Injection** | Implemented | Single-fault interactive triggering |
| **Statistical Baseline** | Implemented | $Z$-score anomaly detection |
| **Correlation / RCA Engine** | Initial Implementation | Rule-based decision framework |
| **Persistent Event Store** | Planned | Phase II target |
| **Digital Twin Recovery** | Planned | Phase III target |
| **Temporal ML Models** | Planned | LSTM & TCN evaluation pipeline |
| **Edge AI Export** | Planned | Quantized ONNX / TFLite runtime |

---

## System Architecture

The core design principle is the **Canonical Telemetry Boundary**: the rest of the application remains agnostic to whether telemetry originates from the simulator, a ground station, or a flight dataset.

```text
                  TELEMETRY SOURCES
        ┌─────────────────┼─────────────────┐
        │                 │                 │
    Simulator      Ground Station    External Source
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
             Canonical Telemetry Contract
                          │
                    Preprocessing
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
 Statistical Baseline           Temporal ML Models
          └───────────────┬───────────────┘
                          │
                  Anomaly Detection
                          │
             Multi-Parameter Correlation
                          │
                     RCA Engine
                          │
                    Mission Events
                 ┌────────┴────────┐
                 ▼                 ▼
          Mission Control     Digital Twin
                                   │
                           Simulated Recovery
                                   │
                         Recovery Verification
```

### Telemetry Pipeline

Telemetry packets follow a strict JSON payload specification from the provider service down to the client dashboard:

$$\text{Simulator / Source} \xrightarrow{\quad\text{TelemetryPacket}\quad} \text{FastAPI} \xrightarrow{\quad\text{WebSocket}\quad} \text{Next.js UI}$$

### Canonical Telemetry Schema

```json
{
  "missionId": "rvce-cubesat-01",
  "spacecraftId": "cosmos-sat-01",
  "timestamp": "2026-09-21T15:40:00Z",
  "source": "simulator",
  "sequence": 1042,
  "telemetry": {
    "battery_voltage": 7.42,
    "battery_current": 1.82,
    "battery_temperature": 31.2,
    "bus_voltage": 7.31,
    "state_of_charge": 82.1,
    "obc_cpu_utilization": 34.2,
    "obc_temperature": 40.0,
    "obc_memory_utilization": 42.3,
    "reboot_count": 0,
    "angular_velocity_x": 0.004,
    "angular_velocity_y": -0.002,
    "angular_velocity_z": 0.008,
    "attitude_error": 0.15,
    "reaction_wheel_speed": 1750,
    "rssi": -68,
    "packet_loss": 0.8,
    "uplink_count": 0,
    "downlink_count": 1042,
    "payload_temperature": 25.1
  }
}
```

---

## Spacecraft Simulation

The backend simulator mimics real-world subsystem cross-coupling. For example, high OBC processing loads increase internal temperatures, which in turn propagate to the payload thermal budget.

```text
SpacecraftSimulator
├── EPSSimulator (Degradation, Overheating, Undervoltage)
├── OBCSimulator (CPU Overload, Thermal runaway)
├── ADCSSimulator (Reaction wheel instability)
├── CommSimulator (RSSI decay, Packet drop)
├── ThermalSimulator (Subsystem thermal coupling)
└── FaultManager (State control)
```

---

## Anomaly Detection & RCA Engine

### Statistical Baseline

The initial baseline computes real-time $Z$-scores using nominal operational bounds:

$$Z = \frac{\vert{}x - \mu\vert{}}{\sigma}$$

```text
  Z-score Boundary            Classification
 ────────────────────────────────────────────
      z < 2.0                   NORMAL
  2.0 ≤ z < 3.0                 WARNING
      z ≥ 3.0                   CRITICAL
```

#### Engineering Reference Bounds
- **Battery Voltage:** $7.42 \pm 0.05\text{ V}$
- **OBC Temperature:** $40.0 \pm 2.5\,^\circ\text{C}$
- **Attitude Error:** $0.15 \pm 0.10^\circ$
- **RSSI:** $-68 \pm 4\text{ dBm}$

### Root Cause Analysis (RCA)

When multiple telemetry channels breach nominal thresholds simultaneously, the heuristic engine correlates the symptoms into probable failure modes:

$$\text{Telemetry Anomalies} \implies \text{Pattern Match} \implies \text{Candidate Cause + Confidence Score}$$

- **OBC Overload Example:** High CPU Load + Elevated OBC Temp $\implies$ **OBC: CPU Overload**
- **EPS Fault Example:** Low Voltage + High Battery Current + Bus Undervoltage $\implies$ **EPS: Battery Degradation**

### Supported Fault Scenarios

| Fault Scenario | Primary Subsystem | Primary Telemetry Indicators |
| :--- | :--- | :--- |
| **Battery Degradation** | EPS | Voltage $\downarrow$, Current $\uparrow$, Bus Voltage $\downarrow$ |
| **Battery Overheating** | EPS / Thermal | Battery Temperature $\uparrow$ |
| **Bus Undervoltage** | EPS | Battery Voltage $\downarrow$, Bus Voltage $\downarrow$ |
| **CPU Overload** | OBC | CPU Usage $\uparrow$, Memory Usage $\uparrow$, OBC Temp $\uparrow$ |
| **OBC Overheating** | OBC | OBC Temperature $\uparrow$ |
| **ADCS Instability** | ADCS | Angular Velocity Error $\uparrow$, Reaction Wheel RPM $\uparrow$ |
| **Comm Degradation** | COMM | RSSI $\downarrow$, Packet Loss Rate $\uparrow$ |

---

## ML & Edge AI Research Direction

The long-term objective of COSMOS is evaluating deep-learning models for onboard CubeSat microcontrollers and edge chips.

```text
Statistical Baseline ──► LSTM Models ──► TCN Models ──► Quantization (INT8) ──► Edge Execution
```

### Target Evaluation Metrics
- **Model Performance:** Precision, Recall, $F_1$-score, False Positive Rate (FPR), Detection Latency.
- **Edge Overhead:** Inference Latency ($\text{ms}$), Model Size ($\text{MB}$), Memory Footprint ($\text{RAM}$), Power/CPU Consumption.

---

## Repository Structure

```text
cosmos/
├── apps/
│   └── web/                   # Next.js mission-control application
│       ├── convex/            # Convex backend schemas and functions
│       └── src/               # React UI components & app routes
├── services/
│   ├── telemetry/             # FastAPI stream service & physics simulator
│   ├── ml/                    # Training routines, baselines, and inference scripts
│   ├── rca/                   # Subsystem correlation rules
│   └── digital-twin/          # High-fidelity spacecraft behavior models
├── models/                    # Neural net checkpoints and quantized files
├── datasets/                  # Processed nominal & anomaly telemetry logs
└── docs/                      # Architectural specs and API documentation
```

---

## Technology Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Recharts.
- **Application State & Database:** Convex.
- **Backend & Simulation:** Python 3.11+, FastAPI, Pydantic, WebSockets.
- **Machine Learning (Planned):** PyTorch, ONNX Runtime, TensorFlow Lite.

---

## Local Development Setup

### Prerequisites

- **Node.js:** v18.x or later
- **Python:** v3.11 or higher
- **Package Managers:** `npm` and `pip`

### Step-by-Step Execution

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/cosmos.git
   cd cosmos
   ```

2. **Start the Convex Application Backend**
   ```bash
   cd apps/web
   npm install
   npx convex dev
   ```

3. **Initialize Python Environment & Start Telemetry Service**  
   *In a new terminal instance:*
   ```bash
   # From the root directory
   python -m venv .venv

   # On Windows PowerShell:
   .\.venv\Scripts\Activate.ps1

   # On Linux/macOS:
   # source .venv/bin/activate

   pip install -r requirements.txt
   uvicorn services.telemetry.api:app --reload --port 8000
   ```

4. **Launch Mission Control Interface**  
   *In a third terminal instance:*
   ```bash
   cd apps/web
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Seed Mission Database (First Time Only)**
   ```bash
   cd apps/web
   npx convex run seed:initializeCOSMOS
   ```

---

## API Endpoints & Operational Flow

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/health` | Verify telemetry service health |
| `GET` | `/telemetry` | Retrieve a single telemetry frame |
| `WS` | `/ws/telemetry` | Real-time canonical telemetry WebSocket stream |
| `GET` | `/faults` | Query currently active injected fault status |
| `POST` | `/faults/activate` | Inject a simulated spacecraft fault |
| `POST` | `/faults/clear` | Restore nominal simulation conditions |

### Example CLI Operational Workflow

Trigger a simulated battery degradation event using PowerShell:
```powershell
Invoke-RestMethod `
  -Uri http://localhost:8000/faults/activate `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"fault":"battery_degradation"}'
```

Clear the active fault condition:
```powershell
Invoke-RestMethod -Uri http://localhost:8000/faults/clear -Method Post
```

---

## Safety Boundary & Limitations

> [!WARNING]
> **COSMOS is currently a simulation and research environment.**
> - **No Active Telecommand Uplink:** The system does not send RF signals, control ground station hardware, or transmit live command frames to actual satellites.
> - **Human-In-The-Loop Design:** Simulated recovery procedures require explicit operator authorization.
> - **Simulation Constraints:** The current Phase-I simulation model uses simplified stochastic dynamics and supports only one active fault scenario at a time.

---

## Project Roadmap

```text
[✓] Phase I   ── Mission Control Foundation & Physics Simulation Baseline
[ ] Phase II  ── Persistent Event Timeline & Guided Operator Recovery Workflows
[ ] Phase III ── Coupled Digital-Twin Simulation Engine
[ ] Phase IV  ── Deep Temporal Anomaly Detection Models (LSTM / TCN)
[ ] Phase V   ── Edge AI Optimization & Microcontroller Benchmarking
[ ] Phase VI  ── Live Hardware-in-the-Loop & Ground Station Ingestion
```

---

## Architecture Principles

- **Telemetry as a Contract:** Downstream analytics treat telemetry identically regardless of origin.
- **Replaceable Simulation:** The software interface handles simulated and flight-proven ground streams interchangeably.
- **Layered Intelligence:** System logic flows through interpretable baselines before relying on machine-learning inferences.
- **Decoupled Architecture:** High-throughput streaming data is separated from application-level state databases.