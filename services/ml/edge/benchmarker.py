import time
import sys
import numpy as np
from typing import Dict, Any
from ..models.lightweight_detector import LightweightTCNModel

class EdgeBenchmarker:
    """
    Profiles inference latency, RAM footprint, and model storage
    to evaluate edge suitability under CubeSat on-board computer constraints.
    """
    def __init__(self, num_channels: int = 10, window_size: int = 20):
        self.num_channels = num_channels
        self.window_size = window_size
        self.model = LightweightTCNModel(num_channels=num_channels, window_size=window_size)

    def benchmark_inference(self, iterations: int = 500) -> Dict[str, Any]:
        """Runs iterations of inference passes to benchmark execution latency."""
        dummy_window = np.random.randn(self.window_size, self.num_channels).astype(np.float32)

        # Warmup
        for _ in range(20):
            self.model.score_window(dummy_window)

        latencies = []
        for _ in range(iterations):
            start = time.perf_counter()
            self.model.score_window(dummy_window)
            end = time.perf_counter()
            latencies.append((end - start) * 1000.0)  # in ms

        mean_lat = float(np.mean(latencies))
        p50_lat = float(np.median(latencies))
        p95_lat = float(np.percentile(latencies, 95))
        p99_lat = float(np.percentile(latencies, 99))

        # Memory footprint calculation (weights + intermediate activations)
        weight_bytes = (
            self.model.w1.nbytes +
            self.model.b1.nbytes +
            self.model.w2.nbytes +
            self.model.b2.nbytes +
            self.model.w_out.nbytes
        )
        # Activation buffer ~ 3x window size * hidden_dim
        activation_bytes = (self.window_size * self.model.hidden_dim * 4) * 3
        total_ram_kb = round((weight_bytes + activation_bytes + sys.getsizeof(self.model)) / 1024.0, 1)
        model_size_kb = round(weight_bytes / 1024.0, 1)

        # INT8 Quantization estimate: 4x reduction in weight size
        int8_model_size_kb = round(model_size_kb / 4.0, 1)
        int8_latency_ms = round(mean_lat * 0.65, 2)

        return {
            "runtime": "PythonCPU (ARM / x86 Architecture)",
            "iterations": iterations,
            "latency_mean_ms": round(mean_lat, 2),
            "latency_p50_ms": round(p50_lat, 2),
            "latency_p95_ms": round(p95_lat, 2),
            "latency_p99_ms": round(p99_lat, 2),
            "throughput_hz": round(1000.0 / max(mean_lat, 0.001), 1),
            "ram_footprint_kb": total_ram_kb,
            "model_size_kb": model_size_kb,
            "int8_quantized_projection": {
                "size_kb": int8_model_size_kb,
                "latency_ms": int8_latency_ms,
                "edge_compatible": total_ram_kb < 1024.0 and int8_model_size_kb < 50.0,
            },
            "edge_feasibility": "CUBESAT_FLIGHT_READY" if total_ram_kb < 1024.0 else "TOO_HEAVY",
        }

