import RPi.GPIO as GPIO
import time
from config import MOTOR_PIN

class Motor:
    def __init__(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(MOTOR_PIN, GPIO.OUT)
        self.pwm = GPIO.PWM(MOTOR_PIN, 50)
        self.pwm.start(0)
        self._current_angle = 0

    def _set_angle(self, angle):
        duty = 2 + (angle / 18)
        GPIO.output(MOTOR_PIN, True)
        self.pwm.ChangeDutyCycle(duty)
        time.sleep(0.5)
        GPIO.output(MOTOR_PIN, False)
        self.pwm.ChangeDutyCycle(0)
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
        self.pwm.stop()
        GPIO.cleanup()