import math
import random
from typing import Dict, Any, Optional
from datetime import datetime, timezone

class CubeSatDigitalTwin:
    """
    Multiphysics Digital Twin for RVCE CubeSat-01 (COSMOS-SAT-01).
    Couples Electrical Power System (EPS), Thermal Control System (TCS),
    On-Board Computer (OBC), Attitude Determination & Control System (ADCS),
    and Communications (COMM).
    """

    def __init__(self):
        # Time and Orbit State
        self.sim_time_sec = 0.0
        self.orbit_period_sec = 5688.0  # ~94.8 min LEO orbit (525 km altitude)
        self.eclipse_duration_sec = 2100.0  # ~35 min eclipse in Earth shadow

        # EPS State (2S Li-ion pack, nominal 7.4V - 8.4V, 3200 mAh capacity)
        self.battery_capacity_ah = 3.2
        self.state_of_charge = 0.92  # 92%
        self.nominal_internal_resistance = 0.08  # 80 mOhms
        self.internal_resistance_multiplier = 1.0
        self.battery_temperature = 24.5  # °C
        self.bus_resistance = 0.05  # 50 mOhms
        self.solar_array_peak_power = 18.0  # Watts
        self.current_solar_power = 0.0
        self.base_payload_power = 4.8  # Watts
        self.payload_power = 4.8
        self.obc_power = 1.8  # Watts
        self.adcs_power = 1.2  # Watts
        self.comm_power = 2.4  # Watts
        self.comm_duty_cycle = 1.0  # 100% duty cycle

        # Thermal State (3-node thermal model)
        self.obc_temperature = 34.2  # °C
        self.payload_temperature = 21.0  # °C
        self.radiator_temperature = -5.0  # °C
        self.deep_space_temp_k = 3.0

        # OBC State
        self.cpu_utilization = 28.5  # %
        self.cpu_temperature = 38.6  # °C
        self.memory_utilization = 42.1  # %
        self.reboot_count = 1

        # ADCS State
        self.reaction_wheel_speed = 1840.0  # RPM
        self.attitude_error = 1.15  # degrees
        self.angular_velocity = 0.42  # °/s

        # COMM State
        self.comm_rssi = -76.4  # dBm
        self.packet_loss = 1.2  # %
        self.uplink_count = 84
        self.downlink_count = 14290

        # Active Fault Offsets
        self.fault_active = False
        self.fault_type: Optional[str] = None
        self.fault_severity = 1.0  # 1.0 = low, 2.0 = medium, 3.0 = critical
        self.fault_remaining_sec = 0.0

    def inject_fault(self, fault_type: str, severity: str = "Medium", duration_sec: float = 60.0):
        """Inject a physical fault into the spacecraft subsystems."""
        self.fault_active = True
        self.fault_type = fault_type
        sev_map = {"Low": 1.0, "Medium": 2.0, "Critical": 3.5}
        self.fault_severity = sev_map.get(severity, 2.0)
        self.fault_remaining_sec = duration_sec

    def reset_nominal(self):
        """Reset all fault states back to healthy baseline."""
        self.fault_active = False
        self.fault_type = None
        self.fault_remaining_sec = 0.0
        self.internal_resistance_multiplier = 1.0
        self.payload_power = self.base_payload_power
        self.comm_duty_cycle = 1.0

    def apply_recovery_action(self, action: str):
        """
        Apply a candidate recovery action to the digital twin.
        Example: 'ACTION_EPS_LOAD_SHED'
        """
        if action == "ACTION_EPS_LOAD_SHED" or action == "EXEC_EPS_LOAD_SHED_PAYLOAD":
            # Shed payload power by 65% and drop COMM duty cycle to 20%
            self.payload_power = 1.2
            self.comm_duty_cycle = 0.2
            # Rebalance CPU load
            self.cpu_utilization = 18.0

    def step(self, dt: float = 1.0) -> Dict[str, float]:
        """
        Integrate the spacecraft multiphysics forward by dt seconds.
        Returns a dictionary of all current telemetry channel values.
        """
        self.sim_time_sec += dt

        # 1. Orbital position and Eclipse / Solar cycle
        orbital_phase = (self.sim_time_sec % self.orbit_period_sec)
        in_sunlight = orbital_phase < (self.orbit_period_sec - self.eclipse_duration_sec)
        sun_incidence = max(0.0, math.sin(math.pi * orbital_phase / (self.orbit_period_sec - self.eclipse_duration_sec))) if in_sunlight else 0.0
        self.current_solar_power = self.solar_array_peak_power * sun_incidence

        # 2. Check Fault Expiration
        if self.fault_active:
            self.fault_remaining_sec -= dt
            if self.fault_remaining_sec <= 0:
                self.reset_nominal()

        # 3. Apply Fault Dynamics
        r_internal_multiplier = 1.0
        extra_load_current = 0.0

        if self.fault_active:
            if self.fault_type == "battery_degradation":
                # High internal resistance spike (up to 4.5x)
                r_internal_multiplier = 1.0 + (1.2 * self.fault_severity)
            elif self.fault_type == "current_spike":
                extra_load_current = 1.5 * self.fault_severity
            elif self.fault_type == "battery_overheating":
                self.battery_temperature += 0.25 * self.fault_severity * dt
            elif self.fault_type == "cpu_overload":
                self.cpu_utilization = min(100.0, 75.0 + 10.0 * self.fault_severity)
                self.cpu_temperature += 0.3 * self.fault_severity * dt
            elif self.fault_type == "wheel_degradation":
                self.attitude_error += 0.15 * self.fault_severity * dt
                self.reaction_wheel_speed += 80.0 * self.fault_severity
            elif self.fault_type == "packet_loss":
                self.packet_loss = min(100.0, 15.0 * self.fault_severity)
                self.comm_rssi -= 5.0 * self.fault_severity

        self.internal_resistance_multiplier = r_internal_multiplier

        # 4. EPS Equivalent Circuit Model
        # Open circuit voltage as function of SoC (for 2S pack: 6.8V at 0% to 8.4V at 100%)
        v_oc = 6.8 + 1.6 * (self.state_of_charge ** 1.2)
        total_subsystem_power = (
            self.obc_power +
            self.payload_power +
            self.adcs_power +
            (self.comm_power * self.comm_duty_cycle)
        )
        # Power from battery: P_batt = Total load power - Solar generated power
        net_power_needed = total_subsystem_power - self.current_solar_power
        battery_current = (net_power_needed / max(v_oc, 6.0)) + extra_load_current

        effective_r_int = self.nominal_internal_resistance * self.internal_resistance_multiplier
        # Terminal battery voltage
        battery_voltage = v_oc - (battery_current * effective_r_int)
        # Bus voltage after distribution resistance
        bus_voltage = battery_voltage - (battery_current * self.bus_resistance)

        # Update State of Charge (Coulomb counting)
        # dt in seconds, capacity in Ah: 3600 * capacity = As
        delta_soc = -(battery_current * dt) / (self.battery_capacity_ah * 3600.0)
        self.state_of_charge = max(0.15, min(1.0, self.state_of_charge + delta_soc))

        # 5. Thermal Multiphysics
        # Joule heating in battery: P_loss = I^2 * R_int
        battery_joule_heat = (battery_current ** 2) * effective_r_int
        # Radiative dissipation: dT/dt proportional to heat in minus heat out
        thermal_dissipation = 0.05 * (self.battery_temperature - self.radiator_temperature)
        self.battery_temperature += (0.15 * battery_joule_heat - thermal_dissipation) * dt
        self.battery_temperature = max(-10.0, min(65.0, self.battery_temperature))

        # OBC thermal tied to CPU utilization
        self.cpu_temperature = 25.0 + (self.cpu_utilization * 0.45) + (math.sin(self.sim_time_sec * 0.05) * 0.5)

        # 6. ADCS & COMM small perturbations
        noise = (random.random() - 0.5) * 0.02
        noise_v = (random.random() - 0.5) * 0.01

        return {
            "battery_voltage": round(battery_voltage + noise_v, 2),
            "battery_current": round(battery_current + noise, 2),
            "battery_temperature": round(self.battery_temperature + (random.random() - 0.5) * 0.1, 1),
            "bus_voltage": round(bus_voltage + noise_v, 2),
            "state_of_charge": round(self.state_of_charge * 100.0, 1),
            "solar_power": round(self.current_solar_power, 2),
            "obc_temperature": round(self.obc_temperature, 1),
            "payload_temperature": round(self.payload_temperature, 1),
            "cpu_utilization": round(max(5.0, min(100.0, self.cpu_utilization + (random.random() - 0.5) * 1.5)), 1),
            "cpu_temperature": round(self.cpu_temperature, 1),
            "memory_utilization": round(self.memory_utilization + (random.random() - 0.5) * 0.2, 1),
            "reboot_count": self.reboot_count,
            "attitude_error": round(max(0.1, self.attitude_error + (random.random() - 0.5) * 0.05), 2),
            "reaction_wheel_speed": round(self.reaction_wheel_speed + (random.random() - 0.5) * 10.0, 0),
            "angular_velocity": round(max(0.01, self.angular_velocity + (random.random() - 0.5) * 0.02), 2),
            "comm_rssi": round(self.comm_rssi + (random.random() - 0.5) * 0.4, 1),
            "packet_loss": round(max(0.0, min(100.0, self.packet_loss + (random.random() - 0.5) * 0.2)), 1),
            "uplink_count": self.uplink_count,
            "downlink_count": self.downlink_count,
        }

    def simulate_recovery_counterfactual(self, horizon_steps: int = 10, dt: float = 5.0) -> Dict[str, Any]:
        """
        Fast-forward simulation comparing:
        1) Unmitigated trajectory (fault continues without intervention)
        2) Mitigated trajectory (candidate recovery action applied)
        """
        # Save current internal state
        saved_soc = self.state_of_charge
        saved_fault_active = self.fault_active
        saved_fault_rem = self.fault_remaining_sec
        saved_r_mult = self.internal_resistance_multiplier
        saved_batt_temp = self.battery_temperature
        saved_payload_pow = self.payload_power
        saved_duty = self.comm_duty_cycle

        # Run unmitigated forward
        unmitigated_points = []
        for _ in range(horizon_steps):
            t_data = self.step(dt)
            unmitigated_points.append(t_data["battery_voltage"])

        # Restore state, apply recovery action, and run mitigated forward
        self.state_of_charge = saved_soc
        self.fault_active = saved_fault_active
        self.fault_remaining_sec = saved_fault_rem
        self.internal_resistance_multiplier = saved_r_mult
        self.battery_temperature = saved_batt_temp
        self.payload_power = saved_payload_pow
        self.comm_duty_cycle = saved_duty

        self.apply_recovery_action("ACTION_EPS_LOAD_SHED")
        mitigated_points = []
        for _ in range(horizon_steps):
            t_data = self.step(dt)
            mitigated_points.append(t_data["battery_voltage"])

        # Restore state so live sim is unharmed
        self.state_of_charge = saved_soc
        self.fault_active = saved_fault_active
        self.fault_remaining_sec = saved_fault_rem
        self.internal_resistance_multiplier = saved_r_mult
        self.battery_temperature = saved_batt_temp
        self.payload_power = saved_payload_pow
        self.comm_duty_cycle = saved_duty

        return {
            "unmitigated": unmitigated_points,
            "mitigated": mitigated_points,
            "recovery_predicted": mitigated_points[-1] >= 7.5,
            "final_unmitigated_v": unmitigated_points[-1],
            "final_mitigated_v": mitigated_points[-1],
        }

