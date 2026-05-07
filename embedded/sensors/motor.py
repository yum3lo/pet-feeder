import pigpio
import time
from config import MOTOR_PIN

SERVO_MIN_PW = 500
SERVO_MAX_PW = 2500

class Motor:
    def __init__(self):
        self.pi = pigpio.pi()
        self.pi.set_mode(MOTOR_PIN, pigpio.OUTPUT)
        self._current_angle = 0

    def _set_angle(self, angle):
        pulse_width = SERVO_MIN_PW + int((angle / 180) * (SERVO_MAX_PW - SERVO_MIN_PW))
        self.pi.set_servo_pulsewidth(MOTOR_PIN, pulse_width)
        time.sleep(0.4)
        self.pi.set_servo_pulsewidth(MOTOR_PIN, 0)
        self._current_angle = angle

    def dispense(self, target_grams, tray_load_cell):
        """
        Rotate motor until tray load cell reads target_grams.
        Returns actual grams dispensed.
        """
        print(f"[MOTOR] Dispensing target: {target_grams}g")
        initial_weight = tray_load_cell.get_weight()
        dispensed = 0

        # Rotate in small increments, checking weight after each
        while dispensed < target_grams:
            self._set_angle(180)
            time.sleep(0.3)
            self._set_angle(0)
            time.sleep(0.3)

            current_weight = tray_load_cell.get_weight()
            dispensed = current_weight - initial_weight
            print(f"[MOTOR] Dispensed so far: {dispensed:.1f}g")

            # Safety: stop if we overshoot by more than 5g
            if dispensed >= target_grams - 2:
                break

        self._set_angle(0)
        print(f"[MOTOR] Done. Total dispensed: {dispensed:.1f}g")
        return dispensed

    def cleanup(self):
        self.pi.set_servo_pulsewidth(MOTOR_PIN, 0)
        self.pi.stop()