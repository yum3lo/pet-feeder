import pigpio
import time
from config import MOTOR_PIN

SERVO_MIN_PW = 500
SERVO_MAX_PW = 2500
SWEEP_STEP_DEGREES = 3
SWEEP_STEP_DELAY = 0.03

class Motor:
    def __init__(self):
        self.pi = pigpio.pi()
        self.pi.set_mode(MOTOR_PIN, pigpio.OUTPUT)
        self._current_angle = 0

    def _angle_to_pw(self, angle):
        return SERVO_MIN_PW + int((angle / 180) * (SERVO_MAX_PW - SERVO_MIN_PW))

    def _sweep_to(self, target_angle):
        start = self._current_angle
        step = SWEEP_STEP_DEGREES if target_angle > start else -SWEEP_STEP_DEGREES
        angles = list(range(start, target_angle, step)) + [target_angle]
        for angle in angles:
            self.pi.set_servo_pulsewidth(MOTOR_PIN, self._angle_to_pw(angle))
            time.sleep(SWEEP_STEP_DELAY)
        self._current_angle = target_angle
        self.pi.set_servo_pulsewidth(MOTOR_PIN, 0)

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
            self._sweep_to(180)
            time.sleep(0.2)
            self._sweep_to(0)
            time.sleep(1.5)  # wait for food to settle before reading

            current_weight = tray_load_cell.get_weight(readings=10)
            dispensed = current_weight - initial_weight
            print(f"[MOTOR] Dispensed so far: {dispensed:.1f}g")

            if dispensed >= target_grams - 2:
                break

        self._sweep_to(0)
        print(f"[MOTOR] Done. Total dispensed: {dispensed:.1f}g")
        return dispensed

    def cleanup(self):
        self.pi.set_servo_pulsewidth(MOTOR_PIN, 0)
        self.pi.stop()