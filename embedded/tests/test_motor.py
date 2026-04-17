import RPi.GPIO as GPIO
import time

MOTOR_PIN = 22

GPIO.setmode(GPIO.BCM)
GPIO.setup(MOTOR_PIN, GPIO.OUT)

pwm = GPIO.PWM(MOTOR_PIN, 50)  # 50Hz PWM frequency for servo
pwm.start(0)

def set_angle(angle):
    """Set servo to angle (0-180 degrees)"""
    duty = 2 + (angle / 18)
    GPIO.output(MOTOR_PIN, True)
    pwm.ChangeDutyCycle(duty)
    time.sleep(0.5)
    GPIO.output(MOTOR_PIN, False)
    pwm.ChangeDutyCycle(0)

try:
    print("Rotating to 0 degrees...")
    set_angle(0)
    time.sleep(1)

    print("Rotating to 90 degrees...")
    set_angle(90)
    time.sleep(1)

    print("Rotating to 180 degrees...")
    set_angle(180)
    time.sleep(1)

    print("Returning to 0 degrees...")
    set_angle(0)
    time.sleep(1)

    print("Motor test complete.")

except KeyboardInterrupt:
    print("Interrupted.")

finally:
    pwm.stop()
    GPIO.cleanup()