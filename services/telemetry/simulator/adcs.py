import random


class ADCSSimulator:
    def update(self, fault=None):
        angular_velocity_x = random.gauss(0.0, 0.015)
        angular_velocity_y = random.gauss(0.0, 0.015)
        angular_velocity_z = random.gauss(0.0, 0.015)

        attitude_error = abs(random.gauss(0.15, 0.05))
        reaction_wheel_speed = random.gauss(1750.0, 60.0)

        if fault == "adcs_instability":
            angular_velocity_x += 0.25
            angular_velocity_y += 0.18
            attitude_error += 2.5
            reaction_wheel_speed += 700

        return {
            "angular_velocity_x": round(angular_velocity_x, 4),
            "angular_velocity_y": round(angular_velocity_y, 4),
            "angular_velocity_z": round(angular_velocity_z, 4),
            "attitude_error": round(attitude_error, 3),
            "reaction_wheel_speed": round(reaction_wheel_speed, 2),
        }