import RPi.GPIO as GPIO
import time
from hx711 import HX711

TRAY_DT = 5
TRAY_SCK = 6

hx = HX711(TRAY_DT, TRAY_SCK)
hx.set_reading_format("MSB", "MSB")
hx.set_reference_unit(3978.9479)
hx.reset()
hx.tare()

print("Tray load cell ready. Place weights and check readings.")
print("Press Ctrl+C to stop.\n")

try:
    while True:
        weight = hx.get_weight(5)
        print(f"Weight: {weight:.1f}g")
        hx.power_down()
        hx.power_up()
        time.sleep(1)
except KeyboardInterrupt:
    print("\nDone.")
finally:
    GPIO.cleanup()